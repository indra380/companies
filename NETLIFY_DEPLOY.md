# Deploying to Netlify (No-build and Build options)

This project is a Vite + TypeScript React app. Browsers can't load TypeScript source directly, so "no-build" deployments require committing the production build output (`dist/`) to the repository and instructing Netlify to publish that folder without running a build command.

Below are two supported workflows:

1) No-build (Netlify does NOT run build): you build locally, commit `dist/`, and Netlify simply serves static files.
2) Build on Netlify (recommended for CI): configure Netlify to run `npm run build` and publish `dist/`.

---

No-build (Quick steps)

1. Build locally:

```powershell
npm install; npm run build
```

2. Verify the `dist/` directory exists and contains `index.html` and bundled assets.

3. Commit the `dist/` directory to the repo (example):

```powershell
git add dist -f
git commit -m "chore: add production build for Netlify no-build deploy"
git push origin your-branch
```

4. Create a new site on Netlify from the repository. In Site settings -> Build & deploy -> Continuous Deployment -> Build settings, set:

- Build command: (leave blank)
- Publish directory: `dist`

Netlify will then deploy the committed `dist/` folder as static files. Because we left the build command blank, Netlify will not run any build. The `netlify.toml` provided includes an SPA redirect so client-side routing works.

Notes:
- If your repo .gitignore ignores `dist/`, you must force-add it with `git add -f dist`.
- Keep `dist/` up to date: every time you change source, run `npm run build` and commit the new `dist/`.

---

Build on Netlify (recommended)

1. In Netlify site settings set the build command and publish directory:

- Build command: `npm run build`
- Publish directory: `dist`

2. Ensure Netlify has the Node version required (set in Netlify UI or via an `engines` property in `package.json`). The project already lists Node >=16.

3. Add any environment variables needed under Site settings → Build & deploy → Environment.

Netlify will install dependencies, run the build, and publish from `dist/`.

---

Troubleshooting

- If the site shows a blank page, confirm the SPA redirect is present (see `netlify.toml`) and that `index.html` references correct asset paths. Vite outputs relative paths by default when built in most setups.
- If build fails on Netlify, check the build log and ensure `node` and `npm` versions match project requirements.

If you'd like, I can run a local build here, verify `dist/`, and optionally commit it for you. Tell me whether you prefer a no-build commit or configuring Netlify to build on deploy.
