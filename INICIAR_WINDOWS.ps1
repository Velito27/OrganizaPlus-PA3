# Inicia el proyecto con Docker Desktop. Requiere ejecutar desde este directorio.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error 'Docker no está instalado. Instala Docker Desktop y vuelve a ejecutar el script.'
    exit 1
}
docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Docker Desktop no está encendido. Inícialo antes de continuar.'
    exit 1
}
if (-not (Test-Path '.env')) {
    $bytes = New-Object byte[] 48
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    $secret = [BitConverter]::ToString($bytes).Replace('-', '').ToLowerInvariant()
    [System.IO.File]::WriteAllText((Join-Path $PSScriptRoot '.env'), "JWT_SECRET=$secret`n")
    Write-Host 'Archivo .env privado creado con clave JWT aleatoria.'
}
docker compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Error 'No se pudieron iniciar todos los servicios. Ejecuta docker compose logs para ver la causa.'
    exit 1
}
Write-Host ''
Write-Host 'Aplicaciones:'
Write-Host 'Angular: http://localhost:4200'
Write-Host 'React:   http://localhost:5173'
Write-Host 'API:     http://localhost:4000/api/health'
Write-Host ''
Write-Host 'Para detener los servicios: docker compose down'
