#!/usr/bin/env node
import { access, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const boardDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(boardDir, "..");
const boardPath = path.join(boardDir, "board-data.json");

const sourceFiles = [
  "environment-state.md",
  "interview-state.md",
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
  const text = await readFile(filePath, "utf8");
  return {
    path: relativePath,
    mtime: stats.mtime.toISOString(),
    placeholder: isPlaceholderMarkdown(text),
    text
  };
}

function isPlaceholderMarkdown(value) {
  const text = String(value || "");
  return /artifact_state\s*:\s*placeholder/i.test(text)
    || /needs_input\s*:\s*yes/i.test(text)
    || /Status\s*:\s*draft/i.test(text);
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

function markdownTables(markdown) {
  const tables = [];
  let current = [];
  for (const line of String(markdown || "").split(/\r?\n/)) {
    if (/^\s*\|.*\|\s*$/.test(line)) {
      current.push(line.trim());
      continue;
    }
    if (current.length) {
      tables.push(current);
      current = [];
    }
  }
  if (current.length) tables.push(current);
  return tables
    .map((table) => table
      .map((line) => line.split("|").slice(1, -1).map(stripMarkdown))
      .filter((cells) => cells.length && !cells.every((cell) => /^:?-{2,}:?$/.test(cell))))
    .filter((table) => table.length >= 2);
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

function normalizeStatus(value, fallback = "후보") {
  const clean = stripMarkdown(value).toLowerCase();
  if (!clean) return fallback;
  if (/완료|done|complete|closed/.test(clean)) return "완료";
  if (/진행|doing|in[\s_-]*progress|active/.test(clean)) return "진행";
  if (/선택|추천|accepted|selected|ready|m001/.test(clean)) return "선택";
  if (/보류|defer|later|backlog|나중/.test(clean)) return "보류";
  if (/제외|not[\s_-]*in[\s_-]*scope|out[\s_-]*of[\s_-]*scope/.test(clean)) return "제외";
  if (/대기|todo|pending|candidate|후보/.test(clean)) return "후보";
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
    value: stripMarkdown(extra.value || ""),
    verification: stripMarkdown(extra.verification || ""),
    status: normalizeStatus(extra.status || "", extra.id === "M001" ? "선택" : "후보"),
    nextAction: stripMarkdown(extra.nextAction || ""),
    source: extra.source || "",
    placeholder: Boolean(extra.placeholder)
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
  const valueIndex = findIndex([/가치/, /효과/, /^value$/]);
  const riskIndex = findIndex([/위험/, /^risk$/]);
  const verificationIndex = findIndex([/검증/, /확인/, /^verification$/]);
  const statusIndex = findIndex([/상태/, /^status$/]);
  const nextActionIndex = findIndex([/다음/, /next/, /action/]);
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
        value: valueIndex >= 0 ? cells[valueIndex] : "",
        risk: riskIndex >= 0 ? cells[riskIndex] : cells.find((cell) => /낮음|중간|높음|low|medium|high/i.test(cell)),
        verification: verificationIndex >= 0 ? cells[verificationIndex] : "",
        status: statusIndex >= 0 ? cells[statusIndex] : "",
        nextAction: nextActionIndex >= 0 ? cells[nextActionIndex] : "",
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
    const status = line.match(/(?:상태|status)\s*[:： ]\s*([^\s/]+)/i)?.[1];
    const nextAction = line.match(/(?:다음\s*행동|next\s*action)\s*[:： ]\s*([^/]+)/i)?.[1];
    const verification = line.match(/(?:검증|verification)\s*[:： ]\s*([^/]+)/i)?.[1];
    const value = line.match(/(?:가치|value)\s*[:： ]\s*([^/]+)/i)?.[1];
    const text = line
      .replace(/^(T\d+|M\d+)\s*[:：.-]\s*/i, "")
      .replace(/\/?\s*(?:유형|type)\s*[:： ]\s*[^\s/]+/gi, "")
      .replace(/\/?\s*(?:위험|risk)\s*[:： ]\s*(?:낮음|중간|높음|low|medium|high)/gi, "")
      .replace(/\/?\s*(?:추천|score)\s*[:： ]\s*\d{1,3}/gi, "")
      .replace(/\/?\s*(?:상태|status)\s*[:： ]\s*[^\s/]+/gi, "")
      .replace(/\/?\s*(?:다음\s*행동|next\s*action)\s*[:： ]\s*[^/]+/gi, "")
      .replace(/\/?\s*(?:검증|verification)\s*[:： ]\s*[^/]+/gi, "")
      .replace(/\/?\s*(?:가치|value)\s*[:： ]\s*[^/]+/gi, "");
    return normalizeTask(text, index, { id, type, risk, score, status, nextAction, verification, value, source });
  }).filter((task) => task.text);
}

function parseMissionDoc(doc, index) {
  const heading = lines(doc.text).map((line) => line.match(/^#\s+(.+)$/)?.[1]).find(Boolean) || "";
  const id = heading.match(/^(M\d+)/i)?.[1] || doc.path.match(/(M\d+)/i)?.[1] || `M${String(index + 1).padStart(3, "0")}`;
  const title = stripMarkdown(heading.replace(/^M\d+\s*[:：.-]\s*/i, "")) || id;
  const verification = firstParagraph(headingSection(doc.text, [/검증/, /verification/i])) || labeledValue(doc.text, ["검증", "Verification"]);
  const nextAction = labeledValue(doc.text, ["다음 행동", "Next Action", "Next"]) || firstParagraph(headingSection(doc.text, [/다음 행동/, /next action/i]));
  const status = labeledValue(doc.text, ["상태", "Status"]) || (id === "M001" ? "선택" : "후보");
  return normalizeTask(title, index, {
    id,
    status: doc.placeholder ? "대기" : status,
    verification,
    nextAction,
    source: doc.path,
    placeholder: doc.placeholder
  });
}

function parseWorkFlows(markdown, source = "work-map.md") {
  const flows = [];
  for (const tableRows of markdownTables(markdown)) {
    const headers = tableRows[0].map((cell) => cell.toLowerCase());
    const findIndex = (patterns) => headers.findIndex((header) => patterns.some((pattern) => pattern.test(header)));
    const areaIndex = findIndex([/업무\s*영역/, /^area$/, /work\s*area/]);
    const taskIndex = findIndex([/작업/, /^task$/, /업무$/]);
    const triggerIndex = findIndex([/trigger/, /시작/, /발생/]);
    const inputsIndex = findIndex([/input/, /입력/, /자료/]);
    const stepsIndex = findIndex([/step/, /단계/, /절차/, /흐름/]);
    const outputIndex = findIndex([/output/, /출력/, /결과물/, /산출물/]);
    const decisionIndex = findIndex([/decision/, /판단/]);
    const evidenceIndex = findIndex([/evidence/, /완료/, /증거/, /검증/]);
    const typeIndex = findIndex([/type/, /유형/, /분류/]);
    const riskIndex = findIndex([/risk/, /위험/]);
    const candidateIndex = findIndex([/candidate/, /후보/, /미션/]);

    if (taskIndex < 0 && stepsIndex < 0 && outputIndex < 0) continue;

    tableRows.slice(1).forEach((cells, index) => {
      const task = taskIndex >= 0 ? cells[taskIndex] : "";
      const steps = stepsIndex >= 0 ? cells[stepsIndex] : "";
      const output = outputIndex >= 0 ? cells[outputIndex] : "";
      if (!task && !steps && !output) return;
      flows.push({
        id: `WF${String(flows.length + 1).padStart(2, "0")}`,
        area: areaIndex >= 0 ? cells[areaIndex] : "",
        task: task || `Workflow ${index + 1}`,
        trigger: triggerIndex >= 0 ? cells[triggerIndex] : "",
        inputs: inputsIndex >= 0 ? cells[inputsIndex] : "",
        steps,
        output,
        decision: decisionIndex >= 0 ? cells[decisionIndex] : "",
        evidence: evidenceIndex >= 0 ? cells[evidenceIndex] : "",
        type: typeIndex >= 0 ? cells[typeIndex] : "",
        risk: riskIndex >= 0 ? cells[riskIndex] : "",
        candidate: candidateIndex >= 0 ? cells[candidateIndex] : "",
        source
      });
    });
  }
  return flows;
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

async function readLogFiles() {
  const logsDir = path.join(repoRoot, "logs");
  if (!(await exists(logsDir))) return [];
  const files = await readdir(logsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();
  const result = [];
  for (const file of markdownFiles) {
    const relativePath = path.join("logs", file);
    const doc = await readMarkdown(relativePath);
    if (doc) result.push(doc);
  }
  return result;
}

function unique(values) {
  return [...new Set(values.map(stripMarkdown).filter(Boolean))];
}

function statusRank(status) {
  return {
    "진행": 0,
    "선택": 1,
    "후보": 2,
    "보류": 3,
    "완료": 4,
    "제외": 5
  }[normalizeStatus(status)] ?? 6;
}

function mergeTasks(tasks) {
  const merged = new Map();
  for (const task of tasks.filter((item) => item && item.text)) {
    const key = task.id && /^(?:T|M)\d+/i.test(task.id) ? task.id.toLowerCase() : task.text.toLowerCase();
    const prev = merged.get(key);
    if (!prev) {
      merged.set(key, task);
      continue;
    }
    merged.set(key, {
      ...prev,
      ...Object.fromEntries(Object.entries(task).filter(([, value]) => value !== "" && value !== null && value !== undefined)),
      score: Math.max(prev.score || 0, task.score || 0),
      source: unique([prev.source, task.source]).join(", ")
    });
  }
  return [...merged.values()].sort((a, b) => statusRank(a.status) - statusRank(b.status) || b.score - a.score);
}

async function mirrorBoardIfWebExists(serialized) {
  const webDir = path.join(repoRoot, "web");
  if (!(await exists(webDir))) return;
  await writeFile(path.join(webDir, "onboarding-board-data.json"), serialized);
}

async function focusBriefBoard() {
  if (process.env.ONBOARDING_NO_OPEN === "1") {
    return;
  }
  const openBoardPath = path.join(boardDir, "open-board.mjs");
  if (!(await exists(openBoardPath))) {
    return;
  }
  const child = spawn(process.execPath, [openBoardPath, "--view", "onboarding"], {
    detached: true,
    stdio: "ignore",
    windowsHide: true
  });
  child.unref();
}

async function main() {
  const docs = (await Promise.all(sourceFiles.map(readMarkdown))).filter(Boolean);
  const missionDocs = await readMissionFiles();
  const logDocs = await readLogFiles();
  const activeDocs = docs.filter((doc) => !doc.placeholder);
  const activeMissionDocs = missionDocs.filter((doc) => !doc.placeholder);
  const byPath = Object.fromEntries(activeDocs.map((doc) => [doc.path, doc]));
  const combined = activeDocs.map((doc) => doc.text).join("\n\n");
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
  const workFlows = parseWorkFlows(workMap);

  const parsedTasks = [
    ...parseTableTasks(backlog, "mission-backlog.md"),
    ...parseBulletTasks(backlog, "mission-backlog.md")
  ];
  const missionTasks = missionDocs.map(parseMissionDoc);
  const activeMissionTasks = missionTasks.filter((task) => !task.placeholder);
  const tasks = mergeTasks([
    ...(parsedTasks.length ? parsedTasks : works.map((work, index) => normalizeTask(work, index, { source: "work-map.md" }))),
    ...activeMissionTasks
  ]);

  const firstMissionDoc = activeMissionDocs[0];
  const displayedMissionDoc = firstMissionDoc || missionDocs[0];
  const displayedLogDoc = logDocs[logDocs.length - 1] || null;
  const firstMissionTask = activeMissionTasks[0] || null;
  const firstMissionText = firstMissionTask?.text || firstParagraph(automation) || firstParagraph(firstMissionDoc?.text || "");
  const firstMission = firstMissionTask || (firstMissionText
    ? normalizeTask(firstMissionText, 0, { id: "M001", status: "선택", source: firstMissionDoc?.path || "automation-brief.md" })
    : tasks.find((task) => task.id === "M001" || ["진행", "선택"].includes(normalizeStatus(task.status))) || tasks[0] || null);

  const sourceSummary = [...docs, ...missionDocs, ...logDocs].map((doc) => ({
    path: doc.path,
    kind: doc.path.startsWith("missions/") ? "mission" : doc.path.startsWith("logs/") ? "log" : "source",
    state: doc.placeholder ? "placeholder" : "ready",
    updatedAt: doc.mtime
  }));

  const artifacts = [
    ["environment-state.md", "환경, GitHub, local/remote, Git 루프 상태"],
    ["interview-state.md", "인터뷰 단계, 다음 질문, 이어가기 메모"],
    ["work-map.md", "역할, 성과, 반복 업무와 작업 지도"],
    ["ontology-seeds.md", "역할, 업무, 입력, 산출물, 규칙 후보"],
    ["mission-backlog.md", "자동화 후보, 우선순위, 위험도"],
    ["automation-brief.md", "첫 자동화 미션의 범위와 검증 기준"],
    [displayedMissionDoc?.path || "missions/M001-<slug>.md", "개별 미션 정의"],
    [displayedLogDoc?.path || "logs/<YYYY-MM-DD>-mission-discovery.md", "세션별 상세 기록"]
  ].map(([name, desc]) => {
    const source = sourceSummary.find((item) => item.path === name);
    const state = source?.state || "waiting";
    return {
      name,
      desc: state === "placeholder" ? `초안 placeholder: ${desc}` : desc,
      state,
      source: source ? (state === "placeholder" ? "초안 placeholder" : source.updatedAt) : ""
    };
  });

  const sourceState = (name) => sourceSummary.find((item) => item.path === name)?.state || "";
  const hasReadySource = (name) => sourceState(name) === "ready";
  const visualizations = [
    { id: "environment-concept", type: "concept-flow", title: "현재 폴더와 local/remote 개념", source: "environment-state.md" },
    { id: "onboarding-progress", type: "branch-graph", title: "온보딩 진행 브랜치 그래프", source: ".onboarding/state.json" },
    { id: "work-definition", type: "work-map-tree", title: "역할에서 업무 영역까지", source: "work-map.md" },
    { id: "workflow-decomposition", type: "workflow-flow", title: "업무 분해 흐름", source: "work-map.md" },
    { id: "candidate-comparison", type: "risk-value-matrix", title: "자동화 후보 비교", source: "mission-backlog.md" },
    { id: "mission-status", type: "mission-kanban", title: "미션 작업 현황", source: "mission-backlog.md" },
    { id: "mission-scope", type: "decision-map", title: "미션 범위와 가정", source: firstMissionDoc?.path || "automation-brief.md" },
    { id: "artifact-authority", type: "artifact-table", title: "산출물 원본 기준", source: "board-data.json" }
  ].map((item) => ({
    ...item,
    status: item.source === ".onboarding/state.json" || item.source === "board-data.json" || hasReadySource(item.source) ? "ready" : "waiting"
  }));

  const boardData = {
    version: 1,
    updatedAt: new Date().toISOString(),
    sources: sourceSummary,
    role,
    outcomes,
    works,
    workFlows,
    inputs,
    risks,
    tasks,
    firstMission,
    artifacts,
    visualizations,
    summary: firstMission ? `${firstMission.id}: ${firstMission.text}` : ""
  };

  await mkdir(boardDir, { recursive: true });
  const serialized = `${JSON.stringify(boardData, null, 2)}\n`;
  await writeFile(boardPath, serialized);
  await mirrorBoardIfWebExists(serialized);
  await focusBriefBoard();
  console.log(`board-data ${tasks.length} tasks ${sourceSummary.length} sources`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
