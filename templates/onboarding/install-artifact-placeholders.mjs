#!/usr/bin/env node
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const boardDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(boardDir, "..");
const templateRoot = path.join(boardDir, "artifact-templates");
const today = new Date().toISOString().slice(0, 10);
const createdAt = new Date().toISOString();

const artifacts = [
  ["environment-state.md", "environment-state.md"],
  ["interview-state.md", "interview-state.md"],
  ["work-map.md", "work-map.md"],
  ["ontology-seeds.md", "ontology-seeds.md"],
  ["mission-backlog.md", "mission-backlog.md"],
  ["automation-brief.md", "automation-brief.md"],
  ["missions/M001-placeholder.md", "missions/M001-placeholder.md"],
  ["logs/mission-discovery.md", `logs/${today}-mission-discovery.md`]
];

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function hasExistingMissionPlaceholder(targetPath) {
  if (!targetPath.startsWith("missions/")) return false;
  const missionsDir = path.join(repoRoot, "missions");
  if (!(await exists(missionsDir))) return false;
  const files = await readdir(missionsDir);
  return files.some((file) => /^M001[-_].*\.md$/i.test(file));
}

function renderTemplate(value) {
  return String(value)
    .replaceAll("{{DATE}}", today)
    .replaceAll("{{CREATED_AT}}", createdAt);
}

async function copyIfMissing(templateRelativePath, targetRelativePath) {
  const targetPath = path.join(repoRoot, targetRelativePath);
  if (await exists(targetPath)) {
    return { target: targetRelativePath, status: "kept" };
  }
  if (await hasExistingMissionPlaceholder(targetRelativePath)) {
    return { target: targetRelativePath, status: "kept" };
  }

  const templatePath = path.join(templateRoot, templateRelativePath);
  const text = renderTemplate(await readFile(templatePath, "utf8"));
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, text);
  return { target: targetRelativePath, status: "created" };
}

async function main() {
  const results = [];
  for (const [templatePath, targetPath] of artifacts) {
    results.push(await copyIfMissing(templatePath, targetPath));
  }
  const created = results.filter((result) => result.status === "created").length;
  const kept = results.filter((result) => result.status === "kept").length;
  console.log(`artifact-placeholders created=${created} kept=${kept}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
