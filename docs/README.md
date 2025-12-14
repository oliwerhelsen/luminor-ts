# Luminor Documentation

Denna mapp innehåller dokumentationen för Luminor som publiceras på GitHub Pages.

## Lokal utveckling

För att köra dokumentationen lokalt:

```bash
cd docs
bundle install
bundle exec jekyll serve
```

Dokumentationen kommer att vara tillgänglig på `http://localhost:4000`.

## GitHub Pages

Dokumentationen publiceras automatiskt till GitHub Pages när ändringar pushas till `main` branch.

Se till att GitHub Pages är aktiverat i repository settings:
- Settings → Pages
- Source: Deploy from a branch
- Branch: main
- Folder: /docs

