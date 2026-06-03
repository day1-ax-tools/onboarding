#!/usr/bin/env node
import { chmod, mkdir, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const codexCommands = ["codex"];
const claudeCommands = ["claude", "claude-1", "claude-2"];
const cliCommands = [...codexCommands, ...claudeCommands];
const hiddenSupportCommands = ["git", "gh", "node", "python", "python3"];
const commandNamePattern = /^[A-Za-z0-9._+-]+$/;
const baseCommands = [
  "bash",
  "zsh",
  "sh",
  "curl",
  "unzip",
  "tar",
  "gzip",
  "gunzip",
  "shasum",
  "sha256sum",
  "openssl",
  "mkdir",
  "mv",
  "rm",
  "mktemp",
  "pwd",
  "ls",
  "cat",
  "cp",
  "ln",
  "chmod",
  "touch",
  "sed",
  "grep",
  "find",
  "head",
  "tail",
  "date",
  "which",
  "dirname",
  "basename",
  "id",
  "whoami",
  "hostname",
  "uname",
  "tput",
  "stty",
  "wc",
  "awk",
  "cut",
  "sort",
  "uniq",
  "tr",
  "printf",
  "sleep",
  "true",
  "false",
  "test",
  "expr",
  "env"
];

function readArgs(argv) {
  const result = {
    mode: "missing",
    tool: "both",
    supportTools: "hidden",
    systemTools: "minimal",
    hide: [],
    name: "",
    reset: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--mode") result.mode = argv[++index] || result.mode;
    else if (arg === "--tool") result.tool = argv[++index] || result.tool;
    else if (arg === "--support-tools") result.supportTools = argv[++index] || result.supportTools;
    else if (arg === "--system-tools") result.systemTools = argv[++index] || result.systemTools;
    else if (arg === "--hide") {
      const value = argv[++index] || "";
      result.hide.push(...value.split(",").map((command) => command.trim()).filter(Boolean));
    }
    else if (arg === "--name") result.name = argv[++index] || result.name;
    else if (arg === "--reset") result.reset = true;
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  return result;
}

function printHelp() {
  console.log(`Usage:
  node scripts/cli-sandbox.mjs [--mode missing|fake] [--tool codex|claude|both] [--support-tools hidden|real] [--system-tools minimal|all] [--hide command[,command...]] [--name NAME] [--reset]

Modes:
  missing  Hide local codex/claude commands to test the pre-install path.
  fake     Add fake codex/claude commands to test the post-install and first-run path.

Support tools:
  hidden   Hide git, gh, node, python, and python3. This is the default.
  real     Link real git, gh, node, python, and python3 when available.

System tools:
  minimal  Link a curated set of shell utilities. This is the default.
  all      Link available system commands except the selected hidden/fake AI CLI command.

Extra hidden commands:
  --hide   Hide additional commands even when --system-tools all is used. Example: --hide curl,gh

Claude aliases:
  claude, claude-1, and claude-2 are treated as Claude Code commands.
`);
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function commandPath(command) {
  try {
    return execFileSync("/bin/sh", ["-lc", `command -v ${command}`], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

async function linkCommand(command, binDir) {
  const found = commandPath(command);
  if (!found) return false;
  const target = path.join(binDir, command);
  if (existsSync(target)) return true;
  await symlink(found, target);
  return true;
}

async function linkAllSystemCommands(binDir, excluded) {
  const defaultDirs = ["/usr/bin", "/bin", "/usr/sbin", "/sbin", "/opt/homebrew/bin", "/usr/local/bin"];
  const pathDirs = String(process.env.PATH || "").split(":").filter(Boolean);
  const dirs = [...new Set([...pathDirs, ...defaultDirs])];

  for (const dir of dirs) {
    let files = [];
    try {
      files = await readdir(dir);
    } catch {
      continue;
    }

    for (const file of files) {
      if (excluded.has(file)) continue;
      const source = path.join(dir, file);
      const target = path.join(binDir, file);
      if (existsSync(target)) continue;
      try {
        const info = await stat(source);
        if (!info.isFile() || (info.mode & 0o111) === 0) continue;
        await symlink(source, target);
      } catch {
        // Ignore commands we cannot inspect or link.
      }
    }
  }
}

function selectedCommands(tool) {
  if (tool === "codex") return codexCommands;
  if (tool === "claude") return claudeCommands;
  return cliCommands;
}

function unselectedCommands(tool) {
  const selected = new Set(selectedCommands(tool));
  return cliCommands.filter((command) => !selected.has(command));
}

function fakeCli(command) {
  const isClaude = command.startsWith("claude");
  const label = isClaude ? "Claude Code" : "Codex";
  return `#!/usr/bin/env bash
set -u

case "\${1:-}" in
  --version|-v|version)
    printf '%s\\n' "${label} sandbox 0.0.0"
    exit 0
    ;;
esac

cat <<'SCREEN'
${label} sandbox CLI

이 화면은 실제 ${label}가 아니라 온보딩 테스트용 가짜 CLI입니다.
설치 후 첫 실행, 첫 입력문 전달, skill 호출 흐름만 확인합니다.
SCREEN

if [ -t 0 ]; then
  printf '\\n%s\\n' "첫 입력문을 붙여넣어 테스트하세요. 종료하려면 Ctrl-D를 누르세요."
fi

while IFS= read -r line; do
  printf '[%s sandbox input] %s\\n' "${command}" "$line"
done
`;
}

function fakeGh() {
  return `#!/usr/bin/env bash
set -u

if [ "\${1:-}" = "auth" ] && [ "\${2:-}" = "status" ]; then
  cat <<'STATUS'
github.com
  ✓ Logged in to github.com as sandbox-user
  ✓ Git operations protocol: https
  ✓ Token: sandbox-token
STATUS
  exit 0
fi

printf 'gh sandbox: %s\\n' "$*"
`;
}

async function writeExecutable(filePath, content) {
  await rm(filePath, { force: true });
  await writeFile(filePath, content);
  await chmod(filePath, 0o755);
}

function codexInstallScript(sandboxRoot) {
  return `#!/usr/bin/env bash
set -eu

installer="\${AI_CLI_SANDBOX_ROOT:-${sandboxRoot}}/codex-install.sh"
curl -fsSL https://chatgpt.com/codex/install.sh -o "$installer"

printf '\\n%s\\n' "Codex installer will run with real terminal input."
printf '%s\\n' "If it asks 'Start Codex now? [y/N]', press Enter or n to keep install and first login separate."
printf '%s\\n' "Choose y only when you intentionally want to inspect Codex's interactive first-run screen now."

/bin/sh "$installer"
`;
}

async function main() {
  if (process.platform === "win32") {
    throw new Error("scripts/cli-sandbox.mjs is for macOS/Linux/WSL. Use WSL for now, or add a PowerShell-specific sandbox script.");
  }

  const args = readArgs(process.argv.slice(2));
  if (!["missing", "fake"].includes(args.mode)) {
    throw new Error("--mode must be missing or fake");
  }
  if (!["codex", "claude", "both"].includes(args.tool)) {
    throw new Error("--tool must be codex, claude, or both");
  }
  if (!["hidden", "real"].includes(args.supportTools)) {
    throw new Error("--support-tools must be hidden or real");
  }
  if (!["minimal", "all"].includes(args.systemTools)) {
    throw new Error("--system-tools must be minimal or all");
  }
  for (const command of args.hide) {
    if (!commandNamePattern.test(command)) {
      throw new Error(`--hide contains an invalid command name: ${command}`);
    }
  }

  const defaultName = `${args.mode}-${args.tool}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const sandboxRoot = path.join(repoRoot, ".tmp", "cli-sandbox", args.name || defaultName);
  const homeDir = path.join(sandboxRoot, "home");
  const workDir = path.join(sandboxRoot, "work");
  const aiWorkRoot = path.join(sandboxRoot, "ai-work");
  const binDir = path.join(sandboxRoot, "bin");

  if (args.reset) {
    await rm(sandboxRoot, { recursive: true, force: true });
  }
  await mkdir(homeDir, { recursive: true });
  await mkdir(workDir, { recursive: true });
  await mkdir(aiWorkRoot, { recursive: true });
  await mkdir(binDir, { recursive: true });

  const excludedCommands = new Set(selectedCommands(args.tool));
  for (const command of args.hide) {
    excludedCommands.add(command);
  }
  if (args.supportTools === "hidden") {
    for (const command of hiddenSupportCommands) {
      excludedCommands.add(command);
    }
  }

  if (args.systemTools === "all") {
    await linkAllSystemCommands(binDir, excludedCommands);
  } else {
    for (const command of baseCommands) {
      if (excludedCommands.has(command)) continue;
      await linkCommand(command, binDir);
    }
    if (args.supportTools === "real") {
      for (const command of hiddenSupportCommands) {
        if (excludedCommands.has(command)) continue;
        await linkCommand(command, binDir);
      }
    }
  }

  if (args.mode === "missing") {
    for (const command of unselectedCommands(args.tool)) {
      await linkCommand(command, binDir);
    }
  }

  if (args.mode === "fake") {
    for (const command of selectedCommands(args.tool)) {
      await writeExecutable(path.join(binDir, command), fakeCli(command));
    }
    for (const command of unselectedCommands(args.tool)) {
      await linkCommand(command, binDir);
    }
    await writeExecutable(path.join(binDir, "gh"), fakeGh());
  }

  const safePath = binDir;
  const repoUrl = `file://${repoRoot}`;
  const checkCommands = [...new Set([...cliCommands, ...hiddenSupportCommands, ...args.hide])];
  const commandList = checkCommands.join(" ");
  const usefulChecks = checkCommands
    .map((command) => `  command -v ${command} || echo "${command} hidden"`)
    .join("\n");
  const codexInstallerHelp = args.mode === "missing" && args.tool === "codex"
    ? `\nCodex interactive installer:\n  "$AI_CLI_SANDBOX_ROOT/install-codex.sh"\n`
    : "";
  const enterScript = `#!/usr/bin/env bash
export AI_CLI_SANDBOX=1
export AI_CLI_SANDBOX_ROOT=${shellQuote(sandboxRoot)}
export AI_CLI_SANDBOX_MODE=${shellQuote(args.mode)}
export AI_CLI_SANDBOX_SUPPORT_TOOLS=${shellQuote(args.supportTools)}
export AI_CLI_SANDBOX_SYSTEM_TOOLS=${shellQuote(args.systemTools)}
export AI_CLI_SANDBOX_HIDDEN_COMMANDS=${shellQuote([...excludedCommands].join(" "))}
export HOME=${shellQuote(homeDir)}
export AI_WORK_ROOT=${shellQuote(aiWorkRoot)}
export ONBOARDING_NO_OPEN=1
export ONBOARDING_REPO_URL=${shellQuote(repoUrl)}
export PATH=${shellQuote(safePath)}
unalias ${commandList} gh 2>/dev/null || true
unset -f ${commandList} gh 2>/dev/null || true
unfunction ${commandList} gh 2>/dev/null || true
hash -r 2>/dev/null || rehash 2>/dev/null || true
cd ${shellQuote(workDir)}

cat <<'MSG'
AI CLI sandbox is active.

- mode: ${args.mode}
- support tools: ${args.supportTools}
- system tools: ${args.systemTools}
- hidden commands: ${[...excludedCommands].join(", ")}
- work folder: ${workDir}
- HOME: ${homeDir}
- AI_WORK_ROOT: ${aiWorkRoot}

Useful checks:
${usefulChecks}

Bootstrap from this checkout:
  /bin/bash ${repoRoot}/bootstrap/start.sh --tool codex --os mac --shell zsh --work-root "$AI_WORK_ROOT"
${codexInstallerHelp}
MSG
`;
  await writeExecutable(path.join(sandboxRoot, "enter.sh"), enterScript);
  if (args.mode === "missing" && args.tool === "codex") {
    await writeExecutable(path.join(sandboxRoot, "install-codex.sh"), codexInstallScript(sandboxRoot));
  }

  const readme = `# AI CLI Sandbox

This sandbox isolates HOME and PATH so local Codex/Claude installs do not affect onboarding tests.

## Enter

\`\`\`bash
source ${sandboxRoot}/enter.sh
\`\`\`

## Modes

- support tools hidden: git/node/python/python3 are hidden. This is the default.
- support tools real: real git/gh/node/python/python3 are linked when available.
- system tools minimal: curated shell utilities are linked. This is the default.
- system tools all: available system commands are linked except the selected hidden/fake AI CLI command.
- extra hidden commands: ${args.hide.length ? args.hide.join(", ") : "none"}.
- missing: codex/claude/claude-1/claude-2 are hidden, useful for install and PATH-failure screens.
- fake: fake codex/claude/claude-1/claude-2 commands exist, useful for first-run and handoff prompt tests.
- --tool controls which AI CLI command is hidden or faked. Unselected AI CLI commands are linked from the real environment when available.

## Bootstrap Test

\`\`\`bash
/bin/bash ${repoRoot}/bootstrap/start.sh --tool codex --os mac --shell zsh --work-root "$AI_WORK_ROOT"
\`\`\`

## Codex Interactive Installer

When this sandbox was created with \`--mode missing --tool codex\`, run:

\`\`\`bash
"$AI_CLI_SANDBOX_ROOT/install-codex.sh"
\`\`\`

This downloads the installer to a file and runs it with terminal stdin intact. If the installer asks \`Start Codex now? [y/N]\`, press Enter or \`n\` to keep install and first login separate, or choose \`y\` when you intentionally want to inspect the interactive first-run screen.
`;
  await writeFile(path.join(sandboxRoot, "README.md"), readme);

  console.log(`Created CLI sandbox:
  mode: ${args.mode}
  path: ${sandboxRoot}

Enter it with:
  source ${sandboxRoot}/enter.sh

Check hidden/fake commands:
${usefulChecks}
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
