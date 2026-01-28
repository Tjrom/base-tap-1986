# Скрипт для автоматического подключения к GitHub
# Запусти этот скрипт после создания репозитория на GitHub

Write-Host "🚀 Настройка подключения к GitHub..." -ForegroundColor Cyan

# Проверка, что мы в правильной директории
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Ошибка: package.json не найден. Запусти скрипт из папки проекта." -ForegroundColor Red
    exit 1
}

# GitHub username и название репозитория
$GITHUB_USER = "Tjrom"
$REPO_NAME = "base-tap-1986"
$GITHUB_URL = "https://github.com/$GITHUB_USER/$REPO_NAME.git"

Write-Host "📋 Параметры:" -ForegroundColor Yellow
Write-Host "   Username: $GITHUB_USER" -ForegroundColor Gray
Write-Host "   Repository: $REPO_NAME" -ForegroundColor Gray
Write-Host "   URL: $GITHUB_URL" -ForegroundColor Gray
Write-Host ""

# Проверка существования remote
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' уже существует: $existingRemote" -ForegroundColor Yellow
    $response = Read-Host "Заменить? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        git remote remove origin
        Write-Host "✅ Старый remote удалён" -ForegroundColor Green
    } else {
        Write-Host "❌ Отменено" -ForegroundColor Red
        exit 0
    }
}

# Добавление remote
Write-Host "🔗 Добавление remote..." -ForegroundColor Cyan
git remote add origin $GITHUB_URL

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote добавлен успешно!" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка при добавлении remote" -ForegroundColor Red
    exit 1
}

# Переименование ветки в main (если нужно)
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "🔄 Переименование ветки в 'main'..." -ForegroundColor Cyan
    git branch -M main
    Write-Host "✅ Ветка переименована" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Готово! Теперь выполни:" -ForegroundColor Green
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Убедись, что репозиторий создан на GitHub:" -ForegroundColor Yellow
Write-Host "   $GITHUB_URL" -ForegroundColor Cyan
