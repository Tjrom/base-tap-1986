# BASE TAP 1986 — Retro Tap Mini-App for Base

Ретро-тапалка в стиле Notcoin, сделанная как mini-app для Base (Farcaster Mini Apps).

![Base Mini-App](https://img.shields.io/badge/Base-Mini%20App-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

## 🎮 О проекте

Ретро-игра в стиле 80-х годов с неоновым дизайном, где нужно тапать по монете, чтобы зарабатывать очки. Сделана как mini-app для Base (Farcaster Mini Apps) и готова к деплою на Vercel.

### Основной стек

- **Next.js 14** (App Router)
- **TypeScript**
- **@farcaster/miniapp-sdk**

### Фичи

- 🎨 Ретро-80-е UI (неоновая сетка, glow, монета TAP)
- 📊 Счётчики `Score / Best / Taps`
- 🏆 Лидерборд (простая in-memory реализация как демо)
- 🔊 Звук на каждый тап (несколько вариаций звука)
- 📱 Готовый manifest для mini-app (`/.well-known/farcaster.json`)

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/Tjrom/base-tap-1986.git
cd base-tap-1986
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Локальный запуск

```bash
# из корня проекта
npm install
npm run dev
```

Открой `http://localhost:3000` в браузере.

---

## 📦 Ассеты (обязательно перед деплоем)

Создай папку `public` (если её ещё нет) и положи туда:

- `public/sounds/tap1.mp3`
- `public/sounds/tap2.mp3`
- `public/sounds/tap3.mp3`

Любые короткие 8-bit/coin‑звуки, чтобы был звук на каждый тап.

Ретро‑картинки (для манифеста и embed):

- `public/blue-icon.png` — иконка mini‑app
- `public/blue-hero.png` — splash / hero
- `public/screenshot-portrait.png` — скриншот в портретной ориентации
- `public/embed-image.png` — картинка для embed (`fc:miniapp`)

---

## ⚙️ Переменные окружения

Создай `.env.local` в корне проекта либо используй `.env.example`:

```bash
NEXT_PUBLIC_URL=https://your-vercel-app-url.vercel.app
```

На локальном запуске эта переменная используется только для формирования ссылок в метаданных и manifest.

После деплоя на Vercel:

1. Зайди в настройки проекта на Vercel: **Settings → Environment Variables**.
2. Добавь переменную:

   - **Name**: `NEXT_PUBLIC_URL`
   - **Value**: URL продакшен‑деплоя (например, `https://base-tap-1986.vercel.app`)
   - **Environment**: Production (и Preview, если хочешь).

---

## 🌐 Деплой на Vercel

### Вариант A: через GitHub (рекомендуется)

1. Закоммить и запушь проект в репозиторий GitHub.
2. Зайди на `https://vercel.com`, нажми **Add New → Project**.
3. Выбери свой репозиторий.
4. Убедись, что:
   - Framework = **Next.js**
   - Build Command = `next build`
   - Output Directory = `.next`
5. Нажми **Deploy**.
6. После первого деплоя:
   - Скопируй выданный домен (например, `https://base-tap-1986.vercel.app`).
   - Пропиши его в Vercel как `NEXT_PUBLIC_URL`.
   - Запусти повторный деплой (Vercel сам это сделает при изменении env).

### Вариант B: через Vercel CLI

1. Установи CLI:

   ```bash
   npm install -g vercel
   ```

2. Авторизуйся:

   ```bash
   vercel login
   ```

3. Запусти деплой из корня проекта:

   ```bash
   vercel
   ```

4. Следуй интерактивным вопросам (проект на основе Next.js).
5. После первого деплоя:
   - Задай `NEXT_PUBLIC_URL` в настройках проекта на сайте Vercel.
   - Перезапусти деплой (`vercel --prod` или новый push).

---

## 📋 Настройка Base Mini-App (manifest)

Manifest для mini‑app хостится как Next.js route:

- `app/.well-known/farcaster.json/route.ts`

Он отдаёт JSON вида:

```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "miniapp": {
    "version": "1",
    "name": "BASE TAP 1986",
    "homeUrl": "https://your-vercel-app-url.vercel.app",
    "iconUrl": "https://your-vercel-app-url.vercel.app/blue-icon.png",
    "splashImageUrl": "https://your-vercel-app-url.vercel.app/blue-hero.png",
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://your-vercel-app-url.vercel.app/api/webhook",
    "subtitle": "Retro tapper on Base",
    "description": "Tap-to-earn style retro 80s game for Base.",
    "screenshotUrls": [
      "https://your-vercel-app-url.vercel.app/screenshot-portrait.png"
    ],
    "primaryCategory": "social",
    "tags": ["tapper", "retro", "base", "miniapp"],
    "heroImageUrl": "https://your-vercel-app-url.vercel.app/blue-hero.png",
    "tagline": "Tap like it’s 1986",
    "ogTitle": "BASE TAP 1986",
    "ogDescription": "Retro coin tap game on Base.",
    "ogImageUrl": "https://your-vercel-app-url.vercel.app/blue-hero.png"
  }
}
```

### Проверка манифеста

После деплоя на Vercel:

1. Открой в браузере:

   ```text
   https://your-vercel-app-url.vercel.app/.well-known/farcaster.json
   ```

2. Убедись, что JSON отдается корректно и все URL указывают на твой домен.

---

## ✍️ Подписание accountAssociation (Base Build)

По гайду:

- [Create a Mini App](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
- [Migrate an Existing App](https://docs.base.org/mini-apps/quickstart/migrate-existing-apps)

Шаги:

1. Убедись, что продакшен‑деплой доступен и `/.well-known/farcaster.json` открывается.
2. Перейди на:

   - `https://www.base.dev/preview?tab=account`

3. Введи `App URL` — твой Vercel‑домен, например:

   - `base-tap-1986.vercel.app`

4. Нажми **Submit**, затем **Verify** и следуй инструкции:

   - Сервис сгенерирует `header`, `payload`, `signature`.

5. Вставь их в `app/.well-known/farcaster.json/route.ts`:

   ```ts
   accountAssociation: {
     header: '...',
     payload: '...',
     signature: '...'
   }
   ```

6. Задеплой изменения на Vercel ещё раз.

---

## ✅ Проверка mini-app через Base Build Preview

1. Перейди на:

   - `https://www.base.dev/preview`

2. Введи `App URL` (домен Vercel).
3. На вкладках:

   - **Preview / Embeds** — проверка, что mini‑app открывается и embed корректен.
   - **Account** — верификация `accountAssociation`.
   - **Metadata** — проверка полей из манифеста и `fc:miniapp`.

---

## 🎯 Публикация в Base

Когда всё ок:

1. Открой Base app.
2. Создай пост с URL твоей mini‑app (Vercel‑домен).
3. Проверь, что отображается rich‑embed и кнопка запуска mini‑app.

---

## 🔮 TODO для продакшена

Демо версия использует:

- in-memory лидерборд (`app/api/leaderboard/route.ts`) — сбрасывается на каждом рестарте.

Для реального запуска стоит:

- Подключить персистентное хранилище (Vercel Postgres, Supabase и т.п.).
- Добавить авторизацию по Farcaster id через miniapp‑SDK.
- Добавить простую анти‑бот / rate limiting логику.

---

## 📄 Лицензия

MIT License — используй как хочешь!

## 🤝 Вклад

Pull requests приветствуются! Если есть идеи по улучшению — создавай issue.

## 📚 Полезные ссылки

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps)
- [Farcaster Mini Apps SDK](https://github.com/farcasterxyz/miniapp-sdk)
- [Next.js Documentation](https://nextjs.org/docs)

