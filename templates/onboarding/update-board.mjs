#!/usr/bin/env node
import { access, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const boardDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(boardDir, "..");
const boardPath = path.join(boardDir, "board-data.json");

const sourceFiles = [
  "environment-state.md",
  "work-map.md",
  "ontology-seeds.md",
  "mission-backlog.md",
  "automation-brief.md"
];

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readMarkdown(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  if (!(await exists(filePath))) {
    return null;
  }
  const stats = await stat(filePath);
  return {
    path: relativePath,
    mtime: stats.mtime.toISOString(),
    text: await readFile(filePath, "utf8")
  };
}

function stripMarkdown(value) {
  return String(value || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s*/g, "")
    .replace(/^\[[ xX-]\]\s*/g, "")
    .trim();
}

function lines(value) {
  return String(value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function headingSection(markdown, patterns) {
  const sourceLines = String(markdown || "").split(/\r?\n/);
  for (let index = 0; index < sourceLines.length; index += 1) {
    const line = sourceLines[index];
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (!heading) continue;
    const title = stripMarkdown(heading[2]);
    if (!patterns.some((pattern) => pattern.test(title))) continue;
    const level = heading[1].length;
    const body = [];
    for (let next = index + 1; next < sourceLines.length; next += 1) {
      const nextHeading = sourceLines[next].match(/^(#{1,4})\s+(.+)$/);
      if (nextHeading && nextHeading[1].length <= level) break;
      body.push(sourceLines[next]);
    }
    return body.join("\n").trim();
  }
  return "";
}

function bullets(markdown) {
  return lines(markdown)
    .map((line) => line.match(/^\s*(?:[-*]|\d+[.)])\s+(.+)$/)?.[1] || "")
    .map(stripMarkdown)
    .filter(Boolean);
}

function firstParagraph(markdown) {
  return lines(markdown)
    .filter((line) => !/^\s*(?:[-*]|\d+[.)])\s+/.test(line))
    .filter((line) => !/^\|/.test(line))
    .map(stripMarkdown)
    .find(Boolean) || "";
}

function labeledValue(markdown, labels) {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const pattern = new RegExp(`(?:^|\\n)\\s*(?:[-*]\\s*)?(?:${escaped})\\s*[:：]\\s*(.+)`, "i");
  return stripMarkdown(markdown.match(pattern)?.[1] || "");
}

function classify(text) {
  const value = text.toLowerCase();
  if (/수집|찾|검색|gather|collect|crawl|export|추출/.test(value)) return "수집";
  if (/정리|요약|분류|라벨|table|표|summar/.test(value)) return "정리";
  if (/작성|초안|메일|문서|글|draft|write|copy/.test(value)) return "작성";
  if (/변환|포맷|format|convert|csv|json|xlsx|마이그레이션/.test(value)) return "변환";
  if (/검토|리뷰|오류|확인|review|qa|검증/.test(value)) return "검토";
  if (/판단|우선순위|비교|선택|decision|priorit/.test(value)) return "판단 보조";
  if (/업데이트|생성|등록|전송|실행|deploy|send|create/.test(value)) return "실행";
  if (/모니터링|알림|감지|watch|alert|monitor/.test(value)) return "모니터링";
  return "정리";
}

function scoreTask(type, text) {
  let score = 62;
  if (/매일|매주|반복|weekly|daily|정기/.test(text)) score += 14;
  if (/고객|결제|운영|production|삭제|전송/.test(text)) score -= 18;
  if (["정리", "작성", "변환", "검토"].includes(type)) score += 12;
  if (["실행", "모니터링"].includes(type)) score -= 10;
  return Math.max(20, Math.min(95, score));
}

function riskLabel(type, text) {
  if (/삭제|결제|발송|전송|운영|production|고객 데이터/.test(text)) return "높음";
  if (["실행", "모니터링"].includes(type)) return "중간";
  return "낮음";
}

function normalizeRisk(value) {
  const clean = stripMarkdown(value).toLowerCase();
  if (/^(low|낮음)$/.test(clean)) return "낮음";
  if (/^(medium|mid|중간)$/.test(clean)) return "중간";
  if (/^(high|높음)$/.test(clean)) return "높음";
  return stripMarkdown(value);
}

function normalizeTask(text, index, extra = {}) {
  const clean = stripMarkdown(text);
  const type = extra.type || classify(clean);
  return {
    id: extra.id || `T${String(index + 1).padStart(2, "0")}`,
    text: clean,
    type,
    risk: normalizeRisk(extra.risk) || riskLabel(type, clean),
    score: Number.isFinite(Number(extra.score)) ? Number(extra.score) : scoreTask(type, clean),
    source: extra.source || ""
  };
}

function parseTableTasks(markdown, source) {
  const tableRows = lines(markdown)
    .filter((line) => /^\|.*\|$/.test(line))
    .map((line) => line.split("|").slice(1, -1).map(stripMarkdown))
    .filter((cells) => cells.length && !cells.every((cell) => /^:?-{2,}:?$/.test(cell)));

  if (tableRows.length < 2) return [];

  const headers = tableRows[0].map((cell) => cell.toLowerCase());
  const findIndex = (patterns) => headers.findIndex((header) => patterns.some((pattern) => pattern.test(header)));
  const idIndex = findIndex([/^id$/, /번호/, /미션\s*id/, /mission\s*id/]);
  const textIndex = findIndex([/작업/, /업무/, /후보/, /^task$/, /mission/, /description/]);
  const typeIndex = findIndex([/유형/, /분류/, /^type$/, /category/]);
  const riskIndex = findIndex([/위험/, /^risk$/]);
  const scoreIndex = findIndex([/추천/, /점수/, /^score$/, /priority/, /우선/]);

  return tableRows.slice(1)
    .map((cells, index) => {
      const id = idIndex >= 0 ? cells[idIndex] : cells.find((cell) => /^(?:T|M)?\d+/i.test(cell));
      const text = textIndex >= 0
        ? cells[textIndex]
        : cells.find((cell) => cell && !/^(?:T|M)?\d+$/i.test(cell) && !/^\d{1,3}$/.test(cell)) || "";
      if (!text) return null;
      return normalizeTask(text, index, {
        id: id || undefined,
        type: typeIndex >= 0 ? cells[typeIndex] : cells.find((cell) => /수집|정리|작성|변환|검토|판단|실행|모니터링/.test(cell)),
        risk: riskIndex >= 0 ? cells[riskIndex] : cells.find((cell) => /낮음|중간|높음|low|medium|high/i.test(cell)),
        score: scoreIndex >= 0 ? cells[scoreIndex] : cells.find((cell) => /^\d{1,3}$/.test(cell)),
        source
      });
    })
    .filter(Boolean);
}

function parseBulletTasks(markdown, source) {
  return bullets(markdown).map((line, index) => {
    const id = line.match(/^(T\d+|M\d+)/i)?.[1];
    const type = line.match(/(?:유형|type)\s*[:： ]\s*([^\s/]+)/i)?.[1];
    const risk = line.match(/(?:위험|risk)\s*[:： ]\s*(낮음|중간|높음|low|medium|high)/i)?.[1];
    const score = line.match(/(?:추천|score)\s*[:： ]\s*(\d{1,3})/i)?.[1];
    const text = line
      .replace(/^(T\d+|M\d+)\s*[:：.-]\s*/i, "")
      .replace(/\/?\s*(?:유형|type)\s*[:： ]\s*[^\s/]+/gi, "")
      .replace(/\/?\s*(?:위험|risk)\s*[:： ]\s*(?:낮음|중간|높음|low|medium|high)/gi, "")
      .replace(/\/?\s*(?:추천|score)\s*[:： ]\s*\d{1,3}/gi, "");
    return normalizeTask(text, index, { id, type, risk, score, source });
  }).filter((task) => task.text);
}

async function readMissionFiles() {
  const missionsDir = path.join(repoRoot, "missions");
  if (!(await exists(missionsDir))) return [];
  const files = await readdir(missionsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();
  const result = [];
  for (const file of markdownFiles) {
    const relativePath = path.join("missions", file);
    const doc = await readMarkdown(relativePath);
    if (doc) result.push(doc);
  }
  return result;
}

function unique(values) {
  return [...new Set(values.map(stripMarkdown).filter(Boolean))];
}

async function mirrorBoardIfWebExists(serialized) {
  const webDir = path.join(repoRoot, "web");
  if (!(await exists(webDir))) return;
  await writeFile(path.join(webDir, "onboarding-board-data.json"), serialized);
}

async function main() {
  const docs = (await Promise.all(sourceFiles.map(readMarkdown))).filter(Boolean);
  const missionDocs = await readMissionFiles();
  const byPath = Object.fromEntries(docs.map((doc) => [doc.path, doc]));
  const combined = docs.map((doc) => doc.text).join("\n\n");
  const workMap = byPath["work-map.md"]?.text || combined;
  const backlog = byPath["mission-backlog.md"]?.text || "";
  const automation = byPath["automation-brief.md"]?.text || "";

  const roleSection = headingSection(combined, [/역할/, /role/i, /job/i]);
  const outcomesSection = headingSection(combined, [/성과/, /결과/, /책임/, /outcome/i]);
  const worksSection = headingSection(workMap, [/반복 업무/, /업무 영역/, /작업/, /recurring/i, /task/i]);
  const inputsSection = headingSection(combined, [/입력/, /도구/, /tools?/i, /inputs?/i]);
  const risksSection = headingSection(combined, [/위험/, /제약/, /risk/i, /constraint/i]);

  const role = labeledValue(combined, ["역할", "내 역할", "Role", "Job role"]) || firstParagraph(roleSection);
  const outcomes = unique(bullets(outcomesSection));
  const works = unique(bullets(worksSection));
  const inputs = unique(bullets(inputsSection));
  const risks = unique(bullets(risksSection));

  const parsedTasks = [
    ...parseTableTasks(backlog, "mission-backlog.md"),
    ...parseBulletTasks(backlog, "mission-backlog.md")
  ];
  const tasks = (parsedTasks.length ? parsedTasks : works.map((work, index) => normalizeTask(work, index, { source: "work-map.md" })))
    .filter((task, index, list) => list.findIndex((other) => other.text === task.text) === index)
    .sort((a, b) => b.score - a.score);

  const firstMissionDoc = missionDocs[0];
  const firstMissionText = firstParagraph(firstMissionDoc?.text || "") || firstParagraph(automation);
  const firstMission = firstMissionText
    ? normalizeTask(firstMissionText, 0, { id: "M001", source: firstMissionDoc?.path || "automation-brief.md" })
    : tasks[0] || null;

  const sourceSummary = [...docs, ...missionDocs].map((doc) => ({
    path: doc.path,
    kind: doc.path.startsWith("missions/") ? "mission" : "source",
    updatedAt: doc.mtime
  }));

  const artifacts = [
    ["environment-state.md", "환경, GitHub, local/remote, Git 루프 상태"],
    ["work-map.md", "역할, 성과, 반복 업무와 작업 지도"],
    ["ontology-seeds.md", "역할, 업무, 입력, 산출물, 규칙 후보"],
    ["mission-backlog.md", "자동화 후보, 우선순위, 위험도"],
    ["automation-brief.md", "첫 자동화 미션의 범위와 검증 기준"],
    [firstMissionDoc?.path || "missions/M001-<slug>.md", "개별 미션 정의"]
  ].map(([name, desc]) => ({ name, desc, source: sourceSummary.find((item) => item.path === name)?.updatedAt || "" }));

  const boardData = {
    version: 1,
    updatedAt: new Date().toISOString(),
    sources: sourceSummary,
    role,
    outcomes,
    works,
    inputs,
    risks,
    tasks,
    firstMission,
    artifacts,
    summary: firstMission ? `${firstMission.id}: ${firstMission.text}` : ""
  };

  await mkdir(boardDir, { recursive: true });
  const serialized = `${JSON.stringify(boardData, null, 2)}\n`;
  await writeFile(boardPath, serialized);
  await mirrorBoardIfWebExists(serialized);
  console.log(`board-data ${tasks.length} tasks ${sourceSummary.length} sources`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
