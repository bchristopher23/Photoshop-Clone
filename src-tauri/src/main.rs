#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    io::ErrorKind,
    path::{Path, PathBuf},
    process::Command,
    time::{SystemTime, UNIX_EPOCH},
};

#[tauri::command]
fn save_project_to_path(path: String, project_json: String) -> Result<String, String> {
    let target = path_with_missing_extension(path.trim(), "raster")?;
    write_file(&target, project_json.as_bytes())?;
    Ok(target.display().to_string())
}

#[tauri::command]
fn load_project_from_path(path: String) -> Result<String, String> {
    let target = required_path(path.trim())?;
    fs::read_to_string(&target).map_err(|error| format!("Failed to read project file: {error}"))
}

#[tauri::command]
fn export_data_url_to_path(
    path: String,
    data_url: String,
    extension: String,
) -> Result<String, String> {
    let extension = normalize_extension(&extension, &["png", "jpg", "jpeg", "webp", "avif"])?;
    let target = path_with_forced_extension(path.trim(), &extension)?;
    let bytes = decode_data_url(&data_url)?;
    write_file(&target, &bytes)?;
    Ok(target.display().to_string())
}

#[tauri::command]
fn export_avif_data_url_to_path(
    path: String,
    data_url: String,
    quality: Option<u8>,
) -> Result<String, String> {
    let target = path_with_forced_extension(path.trim(), "avif")?;
    let bytes = decode_data_url(&data_url)?;
    let quality = normalize_export_quality(quality);
    export_avif_bytes_to_path(&target, &bytes, quality)?;
    Ok(target.display().to_string())
}

#[tauri::command]
fn save_text_to_path(path: String, contents: String, extension: String) -> Result<String, String> {
    let extension = normalize_extension(&extension, &["svg"])?;
    let target = path_with_forced_extension(path.trim(), &extension)?;
    write_file(&target, contents.as_bytes())?;
    Ok(target.display().to_string())
}

#[tauri::command]
fn path_exists(path: String) -> Result<bool, String> {
    let target = required_path(path.trim())?;
    Ok(target.exists())
}

fn required_path(raw_path: &str) -> Result<PathBuf, String> {
    let trimmed = raw_path.trim();
    if trimmed.is_empty() {
        return Err("A file path is required.".into());
    }

    Ok(PathBuf::from(trimmed))
}

fn path_with_missing_extension(raw_path: &str, extension: &str) -> Result<PathBuf, String> {
    let mut path = required_path(raw_path)?;
    if path.extension().is_none() {
        path.set_extension(extension);
    }

    Ok(path)
}

fn path_with_forced_extension(raw_path: &str, extension: &str) -> Result<PathBuf, String> {
    let mut path = required_path(raw_path)?;
    path.set_extension(extension);
    Ok(path)
}

fn normalize_extension(raw_extension: &str, allowed_extensions: &[&str]) -> Result<String, String> {
    let normalized = raw_extension
        .trim()
        .trim_start_matches('.')
        .to_ascii_lowercase();

    if normalized.is_empty() {
        return Err("A file extension is required.".into());
    }

    if allowed_extensions
        .iter()
        .any(|allowed| *allowed == normalized)
    {
        return Ok(normalized);
    }

    Err(format!("Unsupported file extension: {normalized}"))
}

fn normalize_export_quality(quality: Option<u8>) -> u8 {
    quality.unwrap_or(90).clamp(1, 100)
}

fn export_avif_bytes_to_path(path: &Path, bytes: &[u8], quality: u8) -> Result<(), String> {
    ensure_parent_directory(path)?;
    let input_path = temporary_export_path("png");
    write_file(&input_path, bytes)?;

    let conversion_result = convert_png_to_avif(&input_path, path, quality);
    let _ = fs::remove_file(&input_path);
    conversion_result
}

fn temporary_export_path(extension: &str) -> PathBuf {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    std::env::temp_dir().join(format!(
        "photoshop-export-{}-{timestamp}.{extension}",
        std::process::id()
    ))
}

fn convert_png_to_avif(input_path: &Path, output_path: &Path, quality: u8) -> Result<(), String> {
    let mut errors = Vec::new();

    let imagemagick_error = run_command(
        "magick",
        &[
            input_path.display().to_string(),
            "-quality".into(),
            quality.to_string(),
            output_path.display().to_string(),
        ],
    );
    if let Some(result) = handle_command_result("magick", imagemagick_error, &mut errors)? {
        return Ok(result);
    }

    let convert_error = run_command(
        "convert",
        &[
            input_path.display().to_string(),
            "-quality".into(),
            quality.to_string(),
            output_path.display().to_string(),
        ],
    );
    if let Some(result) = handle_command_result("convert", convert_error, &mut errors)? {
        return Ok(result);
    }

    let ffmpeg_error = run_command(
        "ffmpeg",
        &[
            "-y".into(),
            "-i".into(),
            input_path.display().to_string(),
            "-frames:v".into(),
            "1".into(),
            "-c:v".into(),
            "libaom-av1".into(),
            "-still-picture".into(),
            "1".into(),
            "-crf".into(),
            avif_quality_to_ffmpeg_crf(quality).to_string(),
            "-cpu-used".into(),
            "6".into(),
            output_path.display().to_string(),
        ],
    );
    if let Some(result) = handle_command_result("ffmpeg", ffmpeg_error, &mut errors)? {
        return Ok(result);
    }

    if errors.is_empty() {
        return Err(
            "AVIF export requires a native encoder in PATH (`magick`, `convert`, or `ffmpeg`)."
                .into(),
        );
    }

    Err(format!("AVIF export failed. {}", errors.join(" ")))
}

fn avif_quality_to_ffmpeg_crf(quality: u8) -> u8 {
    let clamped = normalize_export_quality(Some(quality)) as u32;
    (((100 - clamped) * 63) / 99) as u8
}

fn handle_command_result(
    program: &str,
    result: CommandResult,
    errors: &mut Vec<String>,
) -> Result<Option<()>, String> {
    match result {
        CommandResult::Success => Ok(Some(())),
        CommandResult::NotFound => Ok(None),
        CommandResult::Failed(message) => {
            errors.push(format!("{program}: {message}"));
            Ok(None)
        }
    }
}

enum CommandResult {
    Success,
    NotFound,
    Failed(String),
}

fn run_command(program: &str, args: &[String]) -> CommandResult {
    match Command::new(program).args(args).output() {
        Ok(output) if output.status.success() => CommandResult::Success,
        Ok(output) => {
            let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            let details = if !stderr.is_empty() {
                stderr
            } else if !stdout.is_empty() {
                stdout
            } else {
                format!("Exited with status {}", output.status)
            };
            CommandResult::Failed(details)
        }
        Err(error) if error.kind() == ErrorKind::NotFound => CommandResult::NotFound,
        Err(error) => CommandResult::Failed(format!("Failed to start: {error}")),
    }
}

fn ensure_parent_directory(path: &Path) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent)
                .map_err(|error| format!("Failed to prepare output directory: {error}"))?;
        }
    }

    Ok(())
}

fn write_file(path: &Path, bytes: &[u8]) -> Result<(), String> {
    ensure_parent_directory(path)?;
    fs::write(path, bytes).map_err(|error| format!("Failed to write file: {error}"))
}

fn decode_data_url(data_url: &str) -> Result<Vec<u8>, String> {
    let (metadata, payload) = data_url
        .split_once(',')
        .ok_or_else(|| "Expected a data URL with encoded image data.".to_string())?;

    if !metadata.contains(";base64") {
        return Err("Expected base64 image data.".into());
    }

    decode_base64(payload)
}

fn decode_base64(input: &str) -> Result<Vec<u8>, String> {
    let filtered: Vec<u8> = input
        .bytes()
        .filter(|byte| !byte.is_ascii_whitespace())
        .collect();

    if filtered.is_empty() {
        return Ok(Vec::new());
    }

    if filtered.len() % 4 != 0 {
        return Err("Base64 payload length must be a multiple of 4.".into());
    }

    let mut decoded = Vec::with_capacity(filtered.len() / 4 * 3);

    for chunk in filtered.chunks(4) {
        let a = decode_base64_value(chunk[0])?;
        let b = decode_base64_value(chunk[1])?;
        let c = decode_base64_value(chunk[2])?;
        let d = decode_base64_value(chunk[3])?;

        if a == 64 || b == 64 {
            return Err("Invalid base64 padding.".into());
        }

        decoded.push((a << 2) | (b >> 4));

        if c != 64 {
            decoded.push(((b & 0x0f) << 4) | (c >> 2));

            if d != 64 {
                decoded.push(((c & 0x03) << 6) | d);
            }
        } else if d != 64 {
            return Err("Invalid base64 padding.".into());
        }
    }

    Ok(decoded)
}

fn decode_base64_value(byte: u8) -> Result<u8, String> {
    match byte {
        b'A'..=b'Z' => Ok(byte - b'A'),
        b'a'..=b'z' => Ok(byte - b'a' + 26),
        b'0'..=b'9' => Ok(byte - b'0' + 52),
        b'+' => Ok(62),
        b'/' => Ok(63),
        b'=' => Ok(64),
        _ => Err(format!("Invalid base64 character: {}", byte as char)),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            save_project_to_path,
            load_project_from_path,
            export_data_url_to_path,
            export_avif_data_url_to_path,
            save_text_to_path,
            path_exists
        ])
        .run(tauri::generate_context!())
        .expect("error while running Photoshop");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn project_path_gains_default_extension() {
        let path = path_with_missing_extension("tmp/example", "raster").unwrap();
        assert_eq!(
            path.extension().and_then(|value| value.to_str()),
            Some("raster")
        );
    }

    #[test]
    fn export_path_forces_requested_extension() {
        let path = path_with_forced_extension("tmp/example.jpg", "webp").unwrap();
        assert_eq!(
            path.extension().and_then(|value| value.to_str()),
            Some("webp")
        );
    }

    #[test]
    fn data_url_decodes_base64_payload() {
        let bytes = decode_data_url("data:image/png;base64,aGVsbG8=").unwrap();
        assert_eq!(bytes, b"hello");
    }

    #[test]
    fn extension_validation_rejects_unknown_formats() {
        let error = normalize_extension("gif", &["png", "webp"]).unwrap_err();
        assert!(error.contains("Unsupported file extension"));
    }

    #[test]
    fn extension_validation_accepts_avif() {
        let extension =
            normalize_extension("AVIF", &["png", "jpg", "jpeg", "webp", "avif"]).unwrap();
        assert_eq!(extension, "avif");
    }

    #[test]
    fn export_quality_defaults_to_90() {
        assert_eq!(normalize_export_quality(None), 90);
    }

    #[test]
    fn export_quality_is_clamped() {
        assert_eq!(normalize_export_quality(Some(0)), 1);
        assert_eq!(normalize_export_quality(Some(100)), 100);
    }

    #[test]
    fn ffmpeg_crf_mapping_prefers_lower_values_for_higher_quality() {
        assert_eq!(avif_quality_to_ffmpeg_crf(100), 0);
        assert_eq!(avif_quality_to_ffmpeg_crf(1), 63);
    }

    #[test]
    fn path_exists_reflects_filesystem_state() {
        let temp_dir = std::env::temp_dir();
        let path = temp_dir.join(format!("photoshop-test-{}.tmp", std::process::id()));
        fs::write(&path, b"ok").unwrap();

        let exists = path_exists(path.display().to_string()).unwrap();
        assert!(exists);

        fs::remove_file(path).unwrap();
    }
}
