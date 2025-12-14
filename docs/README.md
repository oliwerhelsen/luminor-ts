# brewy Documentation

This directory contains the documentation for brewy that is published on GitHub Pages.

## Local Development

To run the documentation locally:

```bash
cd docs
bundle install
bundle exec jekyll serve
```

The documentation will be available at `http://localhost:4000`.

## GitHub Pages

The documentation is automatically published to GitHub Pages when changes are pushed to the `main` branch.

Make sure GitHub Pages is enabled in repository settings:

- Settings → Pages
- Source: Deploy from a branch
- Branch: main
- Folder: /docs
