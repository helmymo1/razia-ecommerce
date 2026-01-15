$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Output "Stopped process on port 5000"
} else {
    Write-Output "No process found on port 5000"
}
