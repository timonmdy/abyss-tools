# Abyss Tools

A multi-tool platform for the Roblox game **Abyss**, built with React + TypeScript + Tailwind + Vite.

## Local Development

```bash
npm install
npm run dev       # dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## Deploying to GitHub Pages

### One-time setup (do this once per repo)

1. **Push this project to a GitHub repo** named `abyss-tools`
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/abyss-tools.git
   git push -u origin main
   ```

2. **Enable GitHub Pages** in the repo settings:
   - Go to **Settings → Pages**
   - Under *Source*, select **GitHub Actions**
   - Save

3. That's it — every push to `main` automatically builds and deploys.

### If your repo has a different name

Open `.github/workflows/deploy.yml` and change `VITE_BASE_PATH`:

```yaml
env:
  VITE_BASE_PATH: /your-repo-name/
```

### Custom domain (optional)

1. Add your domain in **Settings → Pages → Custom domain**
2. Set `VITE_BASE_PATH: /` in `deploy.yml`

Your live URL will be:
```
https://YOUR_USERNAME.github.io/abyss-tools/
```

---

## Project Structure

```
src/
├── shared/                        # Reusable across ALL apps
│   ├── components/
│   │   ├── AppShell.tsx           # Site-wide layout: header, breadcrumbs, footer
│   │   ├── Bubbles.tsx            # Animated background bubbles
│   │   ├── Dropdown.tsx           # Custom dropdown (z-index safe, no backdrop-blur)
│   │   ├── AbyssInput.tsx         # Number input field
│   │   ├── Stars.tsx              # Star rating display (orange)
│   │   ├── Panel.tsx              # Card panel (no backdrop-blur — see note below)
│   │   └── SettingsModal.tsx      # Global settings modal
│   ├── hooks/
│   │   └── useSettings.ts         # Global settings with localStorage
│   ├── utils/
│   │   └── format.ts              # formatValue, scaleToUnit, timeSuffix
│   └── types/
│       └── index.ts               # DropdownOption, AppSettings, TimeUnit, AppMeta
│
├── apps/
│   ├── registry.ts                # Master list of all apps (drives the home page)
│   └── pond-calculator/
│       ├── PondCalculatorApp.tsx  # Top-level page component for this tool
│       ├── config/
│       │   ├── fish.json          <- Edit your fish here
│       │   ├── qualities.json     <- Edit star multipliers here
│       │   └── mutations.json     <- Edit mutations here
│       ├── types/index.ts
│       ├── hooks/useHistory.ts
│       └── components/
│           ├── Calculator.tsx
│           ├── History.tsx
│           └── DataView.tsx
│
├── App.tsx                        # Root router (home <-> apps)
├── HomePage.tsx                   # App grid / landing page
├── index.css                      # Global styles + keyframes
└── main.tsx
```

## Adding a New App

1. Create `src/apps/my-new-app/` with the same structure as `pond-calculator`
2. Add one entry to `src/apps/registry.ts`
3. Add one route case in `src/App.tsx`

## Editing Game Data

Edit the JSON files in `src/apps/pond-calculator/config/`:

| File | Schema |
|---|---|
| `fish.json` | `[{ "fish_name": string, "time_to_roe": number, "base_value": number }]` |
| `qualities.json` | `[{ "stars": number, "multiplier": number }]` |
| `mutations.json` | `[{ "name": string, "multiplier": number }]` |

## Dropdown Z-index Note

CSS `backdrop-filter`, `filter`, `transform`, and `will-change` create a new stacking
context that clips child z-indexes. The `Panel` component deliberately omits these.
Do not add them to any container that holds a `Dropdown`.
