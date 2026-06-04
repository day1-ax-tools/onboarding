#!/usr/bin/env node
import { access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const boardDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(boardDir, "..");
const statePath = path.join(boardDir, "state.json");
const serverStatePath = path.join(boardDir, "board-server.json");
const serverScript = path.join(boardDir, "board-server.mjs");
const defaultHost = "127.0.0.1";
const defaultPort = Number(process.env.ONBOARDING_BOARD_PORT || 8790);

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
    } else {
      options[key] = next;
      index += 1;
    }
  }
  return options;
}

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

function requestBoard(host, port) {
  return new Promise((resolve) => {
    const request = http.get({
      host,
      port,
      path: "/.onboarding/brief-board.html",
      timeout: 700
    }, (response) => {
      const ok = response.statusCode === 200;
      response.resume();
      response.on("end", () => resolve(ok));
    });
    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });
    request.on("error", () => resolve(false));
  });
}

async function findExistingServer() {
  const state = await readJson(serverStatePath);
  if (!state || !state.host || !state.port) {
    return null;
  }
  return await requestBoard(state.host, state.port)
    ? { host: state.host, port: state.port }
    : null;
}

function isPortFree(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

async function startServer() {
  const existing = await findExistingServer();
  if (existing) {
    return existing;
  }

  for (let port = defaultPort; port < defaultPort + 30; port += 1) {
    if (!(await isPortFree(defaultHost, port))) {
      continue;
    }

    const child = spawn(process.execPath, [
      serverScript,
      "--root", repoRoot,
      "--host", defaultHost,
      "--port", String(port)
    ], {
      detached: true,
      stdio: "ignore",
      windowsHide: true
    });
    child.unref();

    for (let attempt = 0; attempt < 10; attempt += 1) {
      if (await requestBoard(defaultHost, port)) {
        const state = {
          host: defaultHost,
          port,
          pid: child.pid,
          repoRoot,
          updatedAt: new Date().toISOString()
        };
        await writeFile(serverStatePath, `${JSON.stringify(state, null, 2)}\n`);
        return { host: defaultHost, port };
      }
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  }

  throw new Error("brief board local server를 시작할 수 없습니다.");
}

function openUrl(url) {
  if (process.env.ONBOARDING_NO_OPEN === "1") {
    console.log(`brief-board ${url}`);
    return;
  }

  const platform = process.platform;
  let child;
  if (platform === "darwin") {
    child = spawn("open", [url], { detached: true, stdio: "ignore" });
  } else if (platform === "win32") {
    child = spawn("cmd", ["/c", "start", "", url], {
      detached: true,
      stdio: "ignore",
      windowsHide: true
    });
  } else {
    child = spawn("xdg-open", [url], { detached: true, stdio: "ignore" });
  }
  child.on("error", () => {});
  child.unref();
  console.log(`brief-board ${url}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!(await exists(serverScript))) {
    return;
  }

  const state = await readJson(statePath) || {};
  const { host, port } = await startServer();
  const params = new URLSearchParams({
    tool: options.tool || state.tool || "codex",
    os: options.os || state.os || (process.platform === "win32" ? "windows" : "mac"),
    shell: options.shell || state.shell || (process.platform === "win32" ? "powershell" : "zsh"),
    view: options.view || "onboarding"
  });
  openUrl(`http://${host}:${port}/.onboarding/brief-board.html?${params.toString()}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
