# GitHub Actions Workflows

This repository contains several GitHub Actions workflows for CI/CD.

## Workflows

### CI (`ci.yml`)
Runs on every push and pull request to `main` or `develop` branches.
- Lint check with ESLint
- TypeScript type checking
- Build
- Tests with Vitest
- Runs on Node.js 18.x and 20.x

### Test (`test.yml`)
Separate workflow for running tests.
- Runs on Node.js 18.x and 20.x
- Builds project
- Runs all tests

### Lint (`lint.yml`)
Separate workflow for linting.
- ESLint check
- TypeScript type checking

### Publish (`publish.yml`)
Publishes the package to npm when a release is created or manually.
- Runs when a GitHub Release is created
- Can also be run manually with workflow_dispatch
- Bumps version (patch/minor/major) on manual run
- Builds project
- Verifies that version doesn't already exist on npm
- Publishes to npm

**Setup required:**
- Add `NPM_TOKEN` to repository secrets (npm access token)

**Usage:**
1. **Automatic publishing via Release:**
   - Create a GitHub Release with tag (e.g. `v1.0.0`)
   - Workflow runs automatically and publishes to npm

2. **Manual publishing:**
   - Go to Actions → "Publish to npm"
   - Click "Run workflow"
   - Select version bump (patch/minor/major)
   - Workflow bumps version, pushes to git, and publishes to npm

### Deploy Documentation (`docs.yml`)
Publishes documentation to GitHub Pages.
- Runs when files in `docs/` change
- Builds Jekyll site
- Deploys to GitHub Pages

**Setup required:**
- Enable GitHub Pages in repository settings
- Select "GitHub Actions" as source

## Secrets

For workflows to work, you need to configure the following secrets:

### NPM_TOKEN
To publish to npm:
1. Log in to npm: https://www.npmjs.com/login
2. Go to: https://www.npmjs.com/settings/[your-username]/tokens
3. Click "Generate New Token" → "Automation"
4. Copy token (it's only shown once!)
5. Add as secret in repository:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `NPM_TOKEN`
   - Value: Your npm access token
6. Click "Add secret"

**Important:**
- Token must be of type "Automation" to work with CI/CD
- Token needs permissions to publish packages

## Troubleshooting

### Publishing doesn't work

1. **Check that NPM_TOKEN is set:**
   - Go to Settings → Secrets → Actions
   - Verify that `NPM_TOKEN` exists

2. **Check that package name is unique:**
   - Package name in `package.json` must be unique on npm
   - If name already exists, change it in `package.json`

3. **Check that version doesn't already exist:**
   - Workflow automatically checks if version already exists
   - If it exists, bump version first

4. **Check workflow logs:**
   - Go to Actions → Select workflow run
   - Check logs for error messages

### Workflow doesn't run

1. **Check triggers:**
   - Release workflow: Is a GitHub Release created?
   - Manual workflow: Is it run via workflow_dispatch?

2. **Check branch:**
   - Some workflows only run on `main` branch

## Usage

### Automatic CI/CD
All workflows run automatically when:
- Code is pushed to `main` or `develop`
- Pull requests are created against `main` or `develop`
- GitHub Releases are created (for publish)

### Manual publishing
To publish manually:
1. Go to Actions in GitHub
2. Select "Publish to npm"
3. Click "Run workflow"
4. Select version (patch/minor/major)
5. Click "Run workflow"

Workflow will:
1. Bump version in package.json
2. Push changes to git
3. Build project
4. Publish to npm
