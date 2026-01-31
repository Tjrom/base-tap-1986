# Deploy & Base App verification

## 1. Vercel

- Repo is connected; push to `main` deploys to **basetap-1986.vercel.app**.
- **Environment variable**: In Vercel → Project → Settings → Environment Variables add:
  - `NEXT_PUBLIC_URL` = `https://basetap-1986.vercel.app`
- **Deployment Protection**: Turn **off** (Settings → Deployment Protection → Vercel Authentication off) so Base Build can reach your app.

## 2. Base Build – verify ownership

1. Open [base.dev/preview](https://www.base.dev/preview).
2. In **App URL** enter: `basetap-1986.vercel.app` (no `https://`).
3. Click **Submit**.
4. Confirm the **base:app_id** metatag is found (meta is in `app/layout.tsx`).
5. Click **Verify** and follow the steps to generate **accountAssociation** (header, payload, signature).

## 3. Paste accountAssociation into manifest

1. After Verify, copy the three fields: `header`, `payload`, `signature`.
2. In this repo open **app/.well-known/farcaster.json/route.ts**.
3. Replace the empty strings in `accountAssociation`:

```ts
accountAssociation: {
  header: '...',   // paste from Base Build
  payload: '...',
  signature: '...'
},
```

4. Commit and push. Vercel will redeploy.

## 4. Check manifest and metadata

1. Go to [base.dev/preview](https://www.base.dev/preview) again.
2. Add your App URL and check:
   - **Account association** tab: credentials valid.
   - **Metadata** tab: fields from manifest (no missing/red).
3. Use the launch button to open the app inside Base.

## 5. Publish in Base App

Create a **post in the Base app** with your app URL: `https://basetap-1986.vercel.app`. That publishes the mini app.

## 6. Optional – assets for featured

Add images to **public/** as in [public/ASSETS.md](public/ASSETS.md) (icon 1024×1024, cover 1200×630, 3 screenshots 1284×2778). Required for featured placement, not for basic publish.

## Links

- [Base Build Preview](https://www.base.dev/preview)
- [Account association](https://www.base.dev/preview?tab=account)
- [Migrate existing app](https://docs.base.org/mini-apps/quickstart/migrate-existing-apps)
- [Create mini app](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
