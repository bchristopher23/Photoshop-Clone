import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import http from "node:http";
import process from "node:process";
import { join } from "node:path";

const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const targetUrl = `http://${host}:${port}`;
const appJsPath = join(process.cwd(), "web", "app.js");

function hashContent(value) {
  return createHash("sha1").update(value).digest("hex");
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function fetchText(pathname = "/") {
  return new Promise((resolve) => {
    const request = http.get(`${targetUrl}${pathname}`, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 500,
          statusCode: response.statusCode ?? 0,
          body
        });
      });
    });

    request.on("error", () => resolve(null));
    request.setTimeout(1000, () => {
      request.destroy();
      resolve(null);
    });
  });
}

async function probeServer(expectedAppJsHash) {
  const response = await fetchText("/app.js");
  if (!response?.ok) {
    return { available: false, matchesWorkspace: false };
  }

  return {
    available: true,
    matchesWorkspace: hashContent(response.body) === expectedAppJsHash
  };
}

async function waitForServer(deadlineMs = 15000) {
  const start = Date.now();
  const expectedAppJsHash = hashContent(await readFile(appJsPath, "utf8"));

  while (Date.now() - start < deadlineMs) {
    const probe = await probeServer(expectedAppJsHash);
    if (probe.matchesWorkspace) {
      return true;
    }

    await wait(150);
  }

  return false;
}

const expectedAppJsHash = hashContent(await readFile(appJsPath, "utf8"));
const existingServer = await probeServer(expectedAppJsHash);

if (existingServer.matchesWorkspace) {
  console.log(`Reusing existing dev server at ${targetUrl}`);
  process.exit(0);
}

if (existingServer.available) {
  throw new Error(
    `Port ${port} is already serving a different frontend. Stop the existing server at ${targetUrl} and retry.`
  );
}

const child = spawn(process.execPath, ["server.mjs"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(port)
  },
  stdio: "inherit"
});

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

const childExit = new Promise((resolve, reject) => {
  child.on("error", reject);
  child.on("exit", (code, signal) => {
    if (signal || code === 0) {
      resolve({ code, signal });
      return;
    }

    reject(new Error(`Dev server exited with code ${code}`));
  });
});

const ready = await Promise.race([
  waitForServer(),
  childExit.then(() => false)
]);

if (!ready) {
  forwardSignal("SIGTERM");
  throw new Error(`Dev server did not become reachable at ${targetUrl}`);
}

await childExit;
