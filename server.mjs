import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const root = join(process.cwd(), "web");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function resolvePath(urlPathname) {
  const cleanPath = normalize(decodeURIComponent(urlPathname)).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const absolutePath = join(root, requestedPath);

  if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
    return absolutePath;
  }

  return join(root, "index.html");
}

createServer((request, response) => {
  try {
    const requestPath = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`).pathname;
    const filePath = resolvePath(requestPath);
    const extension = extname(filePath);

    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });

    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Photoshop MVP running at http://127.0.0.1:${port}`);
});

