#!/usr/bin/env node
import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const validStatuses = new Set(["pending", "active", "done", "blocked", "skipped"]);
const stepOrder = [
  "cli-install",
  "auth",
  "cli-handoff",
  "kit-install",
  "work-root",
  "github-auth",
  "git-loop",
  "role-map",
  "task-split",
  "mission-select"
];

const stateDir = path.dirname(fileURLToPath(import.meta.url));
const statePath = path.join(stateDir, "state.json");
const templatePath = path.join(stateDir, "state.template.json");

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value.startsWith("--")) {
      const key = value.slice(2);
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) {
        options[key] = true;
      } else {
        options[key] = next;
        index += 1;
      }
    } else {
      positional.push(value);
    }
  }
  return { positional, options };
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
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function loadState() {
  if (!(await exists(statePath)) && (await exists(templatePath))) {
    await copyFile(templatePath, statePath);
  }
  return readJson(statePath);
}

function nextRequiredStep(state) {
  return stepOrder.find((id) => {
    const step = state.steps[id];
    return step && step.required !== false && !["done", "skipped"].includes(step.status);
  });
}

function allRequiredDone(state) {
  return stepOrder.every((id) => {
    const step = state.steps[id];
    return !step || step.required === false || step.status === "done";
  });
}

function applyMetadata(state, options) {
  for (const key of ["tool", "os", "shell"]) {
    if (options[key]) {
      state[key] = options[key];
    }
  }
}

function applyStepUpdate(state, stepId, status, options, now) {
  if (!state.steps[stepId]) {
    throw new Error(`Unknown onboarding step: ${stepId}`);
  }
  if (!validStatuses.has(status)) {
    throw new Error(`Invalid status "${status}". Use pending, active, done, blocked, or skipped.`);
  }

  const step = state.steps[stepId];
  step.status = status;
  step.updatedAt = now;
  if (options.note) {
    step.note = options.note;
  }
  if (options.evidence) {
    step.evidence = Array.isArray(step.evidence) ? step.evidence : [];
    step.evidence.push({ at: now, text: options.evidence });
    step.evidence = step.evidence.slice(-20);
  }

  if (status === "blocked") {
    state.currentStep = stepId;
  } else {
    const next = nextRequiredStep(state);
    state.currentStep = next || stepId;
    if (next && state.steps[next].status === "pending") {
      state.steps[next].status = "active";
      state.steps[next].updatedAt = now;
    }
  }
}

async function mirrorStateIfBoardExists(serialized) {
  const webDir = path.resolve(stateDir, "..", "web");
  if (!(await exists(webDir))) {
    return;
  }
  await writeFile(path.join(webDir, "onboarding-state.json"), serialized);
}

async function main() {
  const { positional, options } = parseArgs(process.argv.slice(2));
  const command = positional[0];
  const now = new Date().toISOString();
  const state = await loadState();

  applyMetadata(state, options);
  state.hooks = state.hooks || { enabled: true, disposeWhen: "all-required-steps-done" };

  if (command === "init" || !command) {
    state.currentStep = nextRequiredStep(state) || state.currentStep || "cli-install";
  } else if (command === "dispose") {
    state.hooks.enabled = false;
    state.hooks.disposedAt = now;
  } else {
    applyStepUpdate(state, command, positional[1] || "done", options, now);
  }

  if (allRequiredDone(state)) {
    state.hooks.enabled = false;
    state.hooks.disposedAt = state.hooks.disposedAt || now;
  }

  state.updatedAt = now;
  await mkdir(stateDir, { recursive: true });
  const serialized = `${JSON.stringify(state, null, 2)}\n`;
  await writeFile(statePath, serialized);
  await mirrorStateIfBoardExists(serialized);
  console.log(`${state.currentStep || "complete"} ${state.hooks.enabled === false ? "hooks-disposed" : "hooks-enabled"}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
