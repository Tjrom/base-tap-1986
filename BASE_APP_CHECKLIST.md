# Base App & Drop Checklist

Чеклист для одобрения в Base App и повышения шансов на дроп от Base.

---

## Одобрение в Base App

### 1. Base Build (обязательно)
- [ ] Зарегистрироваться на [base.dev](https://base.dev) (Base Build)
- [ ] Подключить приложение в Base Build Preview
- [ ] Заполнить [форму на featured placement](https://docs.google.com/forms/d/e/1FAIpQLSeZiB3fmMS7oxBKrWsoaew2LFxGpktnAtPAmJaNZv5TOCXIZg/viewform) после верификации

### 2. Manifest (Farcaster / Base)
- [ ] Подписать manifest (Sign Your Manifest) — [docs](https://docs.base.org/mini-apps/technical-guides/sign-manifest)
- [ ] Заполнить **accountAssociation** через [Base Build → Account association](https://www.base.dev/preview?tab=account) (header, payload, signature)
- [ ] **NEXT_PUBLIC_URL** в `.env` — итоговый URL деплоя (например Vercel)
- [ ] Subtitle: sentence case, без точки в конце (пример: "Retro coin tap game on Base")
- [ ] Описание: понятное, для пользователя

### 3. Ассеты для Featured
- [ ] **Иконка**: 1024×1024 px, PNG, без прозрачности, читаема в малом размере → `public/icon-1024.png`
- [ ] **Cover / Hero**: 1200×630 px (1.91:1), PNG/JPG, без логотипа Base/команды → `public/og-1200x630.png`
- [ ] **Скриншоты**: 3 штуки, портрет 1284×2778 px → `screenshot-portrait.png` и ещё 2

### 4. Featured Guidelines (кратко)
- **Auth**: без редиректов наружу; кошелёк через Base (у нас опционально GM)
- **Onboarding**: понятная цель и как начать; не показывать 0x, показывать nickname/avatar
- **Layout**: CTA по центру; кнопки не обрезаны; тач-таргеты минимум 44px
- **Load**: загрузка <3 сек; действия <1 сек; показывать лоадеры
- **Usability**: светлая и тёмная тема (у нас пока тёмная — при желании добавить light)
- **Client-agnostic**: не хардкодить Farcaster; транзакции — по возможности sponsored

### 5. Уже сделано в приложении
- [x] Share score — шеринг в соцсети / копирование ссылки (виральность)
- [x] GM — транзакция на Base (onchain активность)
- [x] Leaderboard + nickname (социальный элемент)
- [x] Ретро-стиль, темы каждые 10k тапов, музыка on/off
- [x] Farcaster manifest route `/.well-known/farcaster.json`

---

## Дроп от Base (OnChainScore / активность)

Base официально не объявил дроп, но сообщество ориентируется на **OnChainScore** и органическую активность на Base.

### Что повышает шансы
1. **Реальные транзакции на Base** — у нас есть GM (0 value self-transfer), можно добавить:
   - опциональный “Tip” / “Support” (отправка малой суммы на контракт или адрес)
   - минт дешёвого NFT-бейджа за 10k / 50k тапов (если есть контракт)
2. **Использование нативных приложений Base** — приложение в Base App уже считается
3. **Регистрация Base name** — рекомендовать пользователям (в описании или подсказке)
4. **Сообщество** — Base Discord, Guild; опционально: Twitter/GitHub в профиле

### Идеи для следующей итерации
- **Challenge a friend** — ссылка «Побей мои X тапов» с контекстом (query param `?challenge=12345`)
- **Dynamic OG image** — при шере ссылки показывать картинку с score (API route генерирует image)
- **Notifications** (Neynar) — «Твой друг побил твой счёт» (если есть Farcaster context)
- **Payments** — приём/отправка USDC на Base через OnchainKit (опционально)

---

## Полезные ссылки
- [Build Checklist](https://docs.base.org/mini-apps/quickstart/build-checklist)
- [Building for The Base App](https://docs.base.org/mini-apps/quickstart/building-for-the-base-app)
- [Featured Checklist](https://docs.base.org/mini-apps/featured-guidelines/overview)
- [Build Viral Mini Apps](https://docs.base.org/mini-apps/growth/build-viral-mini-apps)
- [Base Build](https://base.dev)
