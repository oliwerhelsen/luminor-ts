# Publishing to npm

This guide describes how to publish brewy to npm.

## Prerequisites

1. **npm account**

   - Create account at https://www.npmjs.com/signup
   - Verify email address

2. **npm access token**

   - Log in to npm
   - Go to: https://www.npmjs.com/settings/[your-username]/tokens
   - Click "Generate New Token"
   - Select type: **Automation** (important for CI/CD)
   - Copy token (it's only shown once!)
   - Add as GitHub Secret:
     - Repository → Settings → Secrets and variables → Actions
     - New repository secret
     - Name: `NPM_TOKEN`
     - Value: Your npm token

3. **Package name**
   - Check that the package name in `package.json` is unique
   - If `brewy` is already taken, change to e.g. `@your-username/brewy` or `brewy-framework`

## Publishing

### Method 1: Automatic via GitHub Release

1. Bump version locally:

   ```bash
   npm version patch  # or minor, major
   git push
   git push --tags
   ```

2. Create GitHub Release:
   - Go to repository → Releases → "Create a new release"
   - Select tag (e.g. `v0.1.0`)
   - Fill in release notes
   - Click "Publish release"
   - Workflow runs automatically and publishes to npm

### Method 2: Manual via GitHub Actions

1. Go to Actions in GitHub
2. Select "Publish to npm"
3. Click "Run workflow"
4. Select version bump (patch/minor/major)
5. Click "Run workflow"
6. Workflow will:
   - Bump version
   - Push to git
   - Build project
   - Publish to npm

### Method 3: Local publishing (for testing)

```bash
# Build project
npm run build

# Test publishing (dry-run)
npm publish --dry-run

# Publish
npm publish --access public
```

## Troubleshooting

### "NPM_TOKEN secret is not set"

- Add `NPM_TOKEN` to repository secrets
- See instructions above

### "Version already exists on npm"

- Version already exists on npm
- Bump version first:
  ```bash
  npm version patch
  git push
  git push --tags
  ```

### "Package name already taken"

- Package name is already taken
- Change `name` in `package.json` to something unique
- E.g. `@your-username/brewy`

### "You do not have permission to publish"

- You are not logged in to npm
- Run: `npm login`
- Or check that NPM_TOKEN is correct

### "Invalid token"

- NPM_TOKEN is wrong or expired
- Create a new token and update secret

### Workflow doesn't run

- Check that workflow file is correct
- Check that you're pushing to the right branch
- Check Actions tab for error messages

## Verify Publishing

After publishing, you can verify:

```bash
# Check if package exists
npm view brewy

# Check specific version
npm view brewy@0.1.0

# Install and test
npm install -g brewy
brewy --version
```

Or visit: https://www.npmjs.com/package/brewy

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **PATCH** (0.1.0 → 0.1.1): Bugfixes
- **MINOR** (0.1.0 → 0.2.0): New features (backward compatible)
- **MAJOR** (0.1.0 → 1.0.0): Breaking changes

## Pre-publishing Checklist

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Project builds without errors (`npm run build`)
- [ ] Version is correct in `package.json`
- [ ] CHANGELOG.md is updated
- [ ] README.md is updated
- [ ] NPM_TOKEN is set in GitHub Secrets
- [ ] Package name is unique on npm
