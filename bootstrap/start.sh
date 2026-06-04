#!/usr/bin/env bash
set -u

REPO_URL="${ONBOARDING_REPO_URL:-https://github.com/day1-ax-tools/onboarding.git}"
ZIP_URL="${ONBOARDING_ZIP_URL:-https://github.com/day1-ax-tools/onboarding/archive/refs/heads/main.zip}"
WORK_ROOT="${AI_WORK_ROOT:-$HOME/Documents/AI-Work}"
ORG_DIR="$WORK_ROOT/day1-ax-tools"
TARGET_DIR="$ORG_DIR/onboarding"
TOOL="codex"
OS_NAME="mac"
DEFAULT_SHELL="${SHELL:-bash}"
SHELL_NAME="${DEFAULT_SHELL##*/}"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --tool)
      TOOL="${2:-codex}"
      shift 2
      ;;
    --os)
      OS_NAME="${2:-mac}"
      shift 2
      ;;
    --shell)
      SHELL_NAME="${2:-bash}"
      shift 2
      ;;
    --work-root)
      WORK_ROOT="${2:-$WORK_ROOT}"
      ORG_DIR="$WORK_ROOT/day1-ax-tools"
      TARGET_DIR="$ORG_DIR/onboarding"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

log() {
  printf '\n%s\n' "$1"
}

have() {
  command -v "$1" >/dev/null 2>&1
}

fail() {
  printf '\n%s\n' "시작을 멈췄습니다: $1" >&2
  exit 1
}

download_zip() {
  archive="$1"
  if have curl; then
    curl -fsSL "$ZIP_URL" -o "$archive"
  elif have python3; then
    python3 - "$ZIP_URL" "$archive" <<'PY'
import sys
import urllib.request
urllib.request.urlretrieve(sys.argv[1], sys.argv[2])
PY
  else
    fail "git, curl, python3 중 하나가 필요합니다. Git을 설치한 뒤 다시 실행해주세요."
  fi
}

extract_zip() {
  archive="$1"
  destination="$2"
  if have unzip; then
    unzip -q "$archive" -d "$destination"
  elif have python3; then
    python3 - "$archive" "$destination" <<'PY'
import sys
import zipfile
with zipfile.ZipFile(sys.argv[1]) as zf:
    zf.extractall(sys.argv[2])
PY
  elif have ditto; then
    mkdir -p "$destination"
    ditto -x -k "$archive" "$destination"
  else
    fail "zip 압축을 풀 도구가 없습니다. unzip 또는 python3가 필요합니다."
  fi
}

local_repo_path() {
  case "$REPO_URL" in
    file://*)
      printf '%s\n' "${REPO_URL#file://}"
      ;;
    *)
      printf '%s\n' ""
      ;;
  esac
}

copy_local_repo() {
  source_dir="$1"
  [ -d "$source_dir/web" ] || fail "로컬 온보딩 키트 위치를 찾을 수 없습니다: $source_dir"
  rm -rf "$TARGET_DIR"
  mkdir -p "$TARGET_DIR" || fail "온보딩 키트를 복사할 폴더를 만들 수 없습니다."

  if have tar; then
    (cd "$source_dir" && tar --exclude .git --exclude .tmp -cf - .) | (cd "$TARGET_DIR" && tar -xf -)
    return
  fi

  for item in "$source_dir"/* "$source_dir"/.[!.]* "$source_dir"/..?*; do
    [ -e "$item" ] || continue
    name="${item##*/}"
    [ "$name" = ".git" ] && continue
    [ "$name" = ".tmp" ] && continue
    cp -R "$item" "$TARGET_DIR/"
  done
}

open_page() {
  index_file="$TARGET_DIR/web/index.html"
  query="?tool=$TOOL&os=$OS_NAME&shell=$SHELL_NAME&bootstrapped=1&repo=$TARGET_DIR"
  file_url="file://$index_file"
  file_url="${file_url// /%20}$query"

  if [ "${ONBOARDING_NO_OPEN:-}" = "1" ]; then
    printf '\n%s\n' "온보딩 시작 페이지를 직접 열어주세요."
    printf '%s\n' "$file_url"
    printf '%s\n' "페이지가 열리면 CLI 설치와 로그인 단계를 이어가세요."
    return
  fi

  if have open; then
    open "$file_url"
    printf '\n%s\n' "온보딩 시작 페이지를 열었습니다."
    printf '%s\n' "열린 페이지에서 CLI 설치와 로그인 단계를 이어가세요."
  elif have xdg-open; then
    if xdg-open "$file_url" >/dev/null 2>&1; then
      printf '\n%s\n' "온보딩 시작 페이지를 열었습니다."
      printf '%s\n' "열린 페이지에서 CLI 설치와 로그인 단계를 이어가세요."
    else
      printf '\n%s\n' "온보딩 시작 페이지를 직접 열어주세요."
      printf '%s\n' "$file_url"
      printf '%s\n' "페이지가 열리면 CLI 설치와 로그인 단계를 이어가세요."
    fi
  else
    printf '\n%s\n' "온보딩 시작 페이지를 직접 열어주세요."
    printf '%s\n' "$file_url"
    printf '%s\n' "페이지가 열리면 CLI 설치와 로그인 단계를 이어가세요."
  fi
}

shell_quote() {
  printf '%q' "$1"
}

verify_onboarding_assets() {
  case "$TOOL" in
    claude)
      instruction_file="$TARGET_DIR/CLAUDE.md"
      skill_file="$TARGET_DIR/.claude/skills/work-mission-discovery/SKILL.md"
      ;;
    *)
      instruction_file="$TARGET_DIR/AGENTS.md"
      skill_file="$TARGET_DIR/.agents/skills/work-mission-discovery/SKILL.md"
      ;;
  esac

  [ -f "$instruction_file" ] || fail "지침 파일을 찾을 수 없습니다: $instruction_file"
  [ -f "$skill_file" ] || fail "work-mission-discovery skill을 찾을 수 없습니다: $skill_file"
}

print_cli_entry_hint() {
  log "CLI handoff 준비가 확인되었습니다."
  printf '%s\n' "아래 명령처럼 온보딩 키트 폴더에서 ${TOOL} 명령을 실행하면 skill을 읽을 수 있습니다."
  printf '  cd %s\n' "$(shell_quote "$TARGET_DIR")"
  printf '  %s\n' "$TOOL"
}

log "AI CLI 온보딩 키트를 준비합니다."
mkdir -p "$ORG_DIR" || fail "작업 폴더를 만들 수 없습니다: $ORG_DIR"

if [ -d "$TARGET_DIR/.git" ] && have git; then
  log "온보딩 키트를 최신 상태로 준비합니다."
  git -C "$TARGET_DIR" pull --ff-only --quiet || log "기존 온보딩 키트로 계속 진행합니다."
elif [ -d "$TARGET_DIR" ]; then
  log "기존 온보딩 키트를 사용합니다."
else
  log "온보딩 키트를 받는 중입니다."
  local_source="$(local_repo_path)"
  if have git; then
    git clone --quiet "$REPO_URL" "$TARGET_DIR" || fail "온보딩 키트를 받을 수 없습니다."
  elif [ -n "$local_source" ] && [ -d "$local_source" ]; then
    copy_local_repo "$local_source"
  else
    tmpdir="$(mktemp -d)"
    archive="$tmpdir/onboarding.zip"
    download_zip "$archive"
    extract_zip "$archive" "$tmpdir"
    extracted="$tmpdir/onboarding-main"
    [ -d "$extracted" ] || fail "다운로드한 zip 구조를 찾을 수 없습니다."
    mv "$extracted" "$TARGET_DIR" || fail "onboarding 폴더를 이동할 수 없습니다."
    rm -rf "$tmpdir"
  fi
  log "온보딩 키트를 받았습니다."
fi

missing_tools=()
for command_name in git gh node python3; do
  have "$command_name" || missing_tools+=("$command_name")
done

if [ "${#missing_tools[@]}" -gt 0 ]; then
  log "다음 CLI 온보딩에서 이어서 설치할 도구입니다."
  for command_name in "${missing_tools[@]}"; do
    printf '  - %s\n' "$command_name"
  done
else
  log "기본 도구가 준비되어 있습니다."
fi

verify_onboarding_assets
print_cli_entry_hint
open_page
