#!/usr/bin/env node
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const boardDir = path.dirname(fileURLToPath(import.meta.url));
const options = parseArgs(process.argv.slice(2));
const root = path.resolve(options.root || path.resolve(boardDir, ".."));
const host = String(options.host || "127.0.0.1");
const port = Number(options.port || process.env.ONBOARDING_BOARD_PORT || 8790);

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"]
]);

function safeFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = url.pathname === "/" ? "/.onboarding/brief-board.html" : url.pathname;
  const decoded = decodeURIComponent(pathname);
  const resolved = path.resolve(root, `.${decoded}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    return null;
  }
  return resolved;
}

const server = createServer(async (request, response) => {
  try {
    const filePath = safeFilePath(request.url || "/");
    if (!filePath) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    const stats = await stat(filePath);
    if (!stats.isFile()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "content-type": contentTypes.get(ext) || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`brief-board-server http://${host}:${port}/.onboarding/brief-board.html`);
});
