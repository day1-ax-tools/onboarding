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

open_page() {
  index_file="$TARGET_DIR/web/index.html"
  query="?tool=$TOOL&os=$OS_NAME&shell=$SHELL_NAME&bootstrapped=1"
  file_url="file://$index_file"
  file_url="${file_url// /%20}$query"

  if [ "${ONBOARDING_NO_OPEN:-}" = "1" ]; then
    printf '\n%s\n%s\n' "브라우저 열기를 건너뜁니다." "$file_url"
    return
  fi

  if have open; then
    open "$file_url"
  elif have xdg-open; then
    xdg-open "$file_url" >/dev/null 2>&1 || true
  else
    printf '\n%s\n%s\n' "브라우저를 자동으로 열 수 없습니다. 아래 파일을 직접 열어주세요." "$index_file"
  fi
}

log "AI CLI 온보딩 키트를 준비합니다."
mkdir -p "$ORG_DIR" || fail "작업 폴더를 만들 수 없습니다: $ORG_DIR"

if [ -d "$TARGET_DIR/.git" ] && have git; then
  log "이미 받은 onboarding repo를 최신 상태로 갱신합니다."
  git -C "$TARGET_DIR" pull --ff-only || log "자동 갱신은 건너뜁니다. 기존 로컬 파일로 계속 진행합니다."
elif [ -d "$TARGET_DIR" ]; then
  log "이미 onboarding 폴더가 있습니다. 기존 폴더를 사용합니다."
else
  if have git; then
    log "Git으로 onboarding repo를 가져옵니다."
    git clone "$REPO_URL" "$TARGET_DIR" || fail "git clone에 실패했습니다."
  else
    log "Git이 없어 zip 파일로 onboarding repo를 가져옵니다."
    tmpdir="$(mktemp -d)"
    archive="$tmpdir/onboarding.zip"
    download_zip "$archive"
    extract_zip "$archive" "$tmpdir"
    extracted="$tmpdir/onboarding-main"
    [ -d "$extracted" ] || fail "다운로드한 zip 구조를 찾을 수 없습니다."
    mv "$extracted" "$TARGET_DIR" || fail "onboarding 폴더를 이동할 수 없습니다."
    rm -rf "$tmpdir"
  fi
fi

log "기본 도구 상태를 확인합니다."
for command_name in git gh node python3; do
  if have "$command_name"; then
    printf '  ✓ %s\n' "$command_name"
  else
    printf '  - %s 없음: 이후 CLI 온보딩에서 설치 또는 대체 경로를 안내합니다.\n' "$command_name"
  fi
done

log "온보딩 시작 페이지를 엽니다."
open_page

printf '\n%s\n' "로컬 위치: $TARGET_DIR"
printf '%s\n' "브라우저가 열리면 CLI 설치와 로그인 단계를 이어가세요."
