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
  $repoParam = [System.Uri]::EscapeDataString((Resolve-Path $targetDir).Path)
  $url = "$uri`?tool=$Tool&os=windows&shell=$Shell&bootstrapped=1&repo=$repoParam"

  if ($env:ONBOARDING_NO_OPEN -eq "1") {
    Write-Host ""
    Write-Host "온보딩 시작 페이지를 직접 열어주세요."
    Write-Host $url
    Write-Host "페이지가 열리면 CLI 설치와 로그인 단계를 이어가세요."
    return
  }

  try {
    Start-Process $url
    Write-Host ""
    Write-Host "온보딩 시작 페이지를 열었습니다."
    Write-Host "열린 페이지에서 CLI 설치와 로그인 단계를 이어가세요."
  } catch {
    Write-Host ""
    Write-Host "온보딩 시작 페이지를 직접 열어주세요."
    Write-Host $url
    Write-Host "페이지가 열리면 CLI 설치와 로그인 단계를 이어가세요."
  }
}

Write-Step "AI CLI 온보딩 키트를 준비합니다."
New-Item -ItemType Directory -Force $orgDir | Out-Null

if ((Test-Path (Join-Path $targetDir ".git")) -and (Has-Command "git")) {
  Write-Step "온보딩 키트를 최신 상태로 준비합니다."
  try {
    git -C $targetDir pull --ff-only --quiet
  } catch {
    Write-Host "기존 온보딩 키트로 계속 진행합니다."
  }
} elseif (Test-Path $targetDir) {
  Write-Step "기존 온보딩 키트를 사용합니다."
} else {
  Write-Step "온보딩 키트를 받는 중입니다."
  if (Has-Command "git") {
    git clone --quiet $repoUrl $targetDir
  } else {
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
  Write-Step "온보딩 키트를 받았습니다."
}

$missingTools = @()
foreach ($commandName in @("git", "gh", "node", "python")) {
  if (!(Has-Command $commandName)) {
    $missingTools += $commandName
  }
}

if ($missingTools.Count -gt 0) {
  Write-Step "다음 CLI 온보딩에서 이어서 설치할 도구입니다."
  foreach ($commandName in $missingTools) {
    Write-Host "  - $commandName"
  }
} else {
  Write-Step "기본 도구가 준비되어 있습니다."
}

Open-StartPage
