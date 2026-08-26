$ErrorActionPreference = "Stop"

# Run this file from the extracted ROSALT project folder.
Set-Location $PSScriptRoot

if (-not (Test-Path ".\package-lock.json")) {
    throw "package-lock.json is missing. Extract the complete ROSALT ZIP, then run this script again."
}

# A clean, lockfile-based install prevents partial SWC / Next.js dependencies.
Remove-Item ".\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".\apps\web\node_modules" -Recurse -Force -ErrorAction SilentlyContinue

npm cache verify
npm ci --include=dev
npm run dev
