param(
  [ValidateSet("codex", "claude")]
  [string]$Tool = "codex",
  [string]$WorkRoot = "",
  [string]$Shell = "powershell"
)

$ErrorActionPreference = "Stop"

$repoUrl = if ($env:ONBOARDING_REPO_URL) { $env:ONBOARDING_REPO_URL } else { "https://github.com/day1-ax-tools/onboarding.git" }
$zipUrl = if ($env:ONBOARDING_ZIP_URL) { $env:ONBOARDING_ZIP_URL } else { "https://github.com/day1-ax-tools/onboarding/archive/refs/heads/main.zip" }
if ([string]::IsNullOrWhiteSpace($WorkRoot)) {
  $WorkRoot = if ($env:AI_WORK_ROOT) { $env:AI_WORK_ROOT } else { Join-Path $HOME "Documents\AI-Work" }
}

$orgDir = Join-Path $WorkRoot "day1-ax-tools"
$targetDir = Join-Path $orgDir "onboarding"

function Write-Step($Message) {
  Write-Host ""
  Write-Host $Message
}

function Has-Command($Name) {
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Open-StartPage {
  $indexPath = Join-Path $targetDir "web\index.html"
  $uri = ([System.Uri](Resolve-Path $indexPath).Path).AbsoluteUri
  $url = "$uri`?tool=$Tool&os=windows&shell=$Shell&bootstrapped=1"
  if ($env:ONBOARDING_NO_OPEN -eq "1") {
    Write-Host ""
    Write-Host "브라우저 열기를 건너뜁니다."
    Write-Host $url
    return
  }
  Start-Process $url
}

Write-Step "AI CLI 온보딩 키트를 준비합니다."
New-Item -ItemType Directory -Force $orgDir | Out-Null

if ((Test-Path (Join-Path $targetDir ".git")) -and (Has-Command "git")) {
  Write-Step "이미 받은 onboarding repo를 최신 상태로 갱신합니다."
  try {
    git -C $targetDir pull --ff-only
  } catch {
    Write-Host "자동 갱신은 건너뜁니다. 기존 로컬 파일로 계속 진행합니다."
  }
} elseif (Test-Path $targetDir) {
  Write-Step "이미 onboarding 폴더가 있습니다. 기존 폴더를 사용합니다."
} else {
  if (Has-Command "git") {
    Write-Step "Git으로 onboarding repo를 가져옵니다."
    git clone $repoUrl $targetDir
  } else {
    Write-Step "Git이 없어 zip 파일로 onboarding repo를 가져옵니다."
    $tempDir = Join-Path $env:TEMP ("onboarding-" + [System.Guid]::NewGuid().ToString("N"))
    $archive = Join-Path $tempDir "onboarding.zip"
    New-Item -ItemType Directory -Force $tempDir | Out-Null
    Invoke-WebRequest -Uri $zipUrl -OutFile $archive
    Expand-Archive -Path $archive -DestinationPath $tempDir -Force
    $extracted = Join-Path $tempDir "onboarding-main"
    if (!(Test-Path $extracted)) {
      throw "다운로드한 zip 구조를 찾을 수 없습니다."
    }
    Move-Item $extracted $targetDir
    Remove-Item $tempDir -Recurse -Force
  }
}

Write-Step "기본 도구 상태를 확인합니다."
foreach ($commandName in @("git", "gh", "node", "python")) {
  if (Has-Command $commandName) {
    Write-Host "  ✓ $commandName"
  } else {
    Write-Host "  - $commandName 없음: 이후 CLI 온보딩에서 설치 또는 대체 경로를 안내합니다."
  }
}

Write-Step "온보딩 시작 페이지를 엽니다."
Open-StartPage

Write-Host ""
Write-Host "로컬 위치: $targetDir"
Write-Host "브라우저가 열리면 CLI 설치와 로그인 단계를 이어가세요."
