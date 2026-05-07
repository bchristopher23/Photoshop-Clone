import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

function run(command, args) {
	const result = spawnSync(command, args, {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"]
	});

	return {
		ok: result.status === 0,
		stdout: (result.stdout || "").trim(),
		stderr: (result.stderr || "").trim(),
		code: result.status
	};
}

function checkCommand(label, command, args = ["--version"]) {
	const result = run(command, args);
	return {
		label,
		ok: result.ok,
		details: result.ok ? (result.stdout || result.stderr || "ok") : (result.stderr || result.stdout || "missing")
	};
}

function logCheck(check) {
	const prefix = check.ok ? "[ok]" : "[missing]";
	console.log(`${prefix} ${check.label}: ${check.details}`);
}

function checkPkgConfig(packageName) {
	const result = run("pkg-config", ["--exists", packageName]);
	return {
		label: `pkg-config:${packageName}`,
		ok: result.ok,
		details: result.ok ? "installed" : "not found"
	};
}

console.log("Photoshop desktop environment check");
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log("");

const commandChecks = [
	checkCommand("node", "node"),
	checkCommand("bun", "bun"),
	checkCommand("cargo", "cargo"),
	checkCommand("rustc", "rustc")
];

for (const check of commandChecks) {
	logCheck(check);
}

const localTauriBinary = join(
	process.cwd(),
	"node_modules",
	".bin",
	process.platform === "win32" ? "tauri.cmd" : "tauri"
);
const tauriCliInstalled = existsSync(localTauriBinary);

console.log("");
logCheck({
	label: "tauri CLI (local bun)",
	ok: tauriCliInstalled,
	details: tauriCliInstalled ? localTauriBinary : "run bun install"
});

if (process.platform === "linux") {
	console.log("");
	console.log("Linux desktop dependencies");

	const linuxChecks = [
		checkPkgConfig("webkit2gtk-4.1"),
		checkPkgConfig("xdo"),
		checkPkgConfig("openssl"),
		checkPkgConfig("ayatana-appindicator3-0.1")
	];

	for (const check of linuxChecks) {
		logCheck(check);
	}

	const missingLinuxPackages = linuxChecks.filter((check) => !check.ok);
	if (missingLinuxPackages.length > 0) {
		console.log("");
		console.log("Install the Debian/Ubuntu prerequisites from the Tauri docs:");
		console.log("sudo apt update");
		console.log("sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev");
	}
}

if (process.platform === "win32") {
	console.log("");
	console.log("Windows prerequisites");
	console.log("- Install Microsoft C++ Build Tools with 'Desktop development with C++'");
	console.log("- Install Microsoft Edge WebView2 Runtime if it is not already present");
	console.log("- Use the MSVC Rust toolchain");
}

if (process.platform === "darwin") {
	console.log("");
	console.log("macOS prerequisites");
	console.log("- Run: xcode-select --install");
}

console.log("");
if (tauriCliInstalled) {
	console.log("Next:");
	console.log("bun run tauri:dev");
} else {
	console.log("Next:");
	console.log("bun install");
	console.log("bun run doctor");
	console.log("bun run tauri:dev");
}
