# GitHub Actions Workflows

Detta repository innehåller flera GitHub Actions workflows för CI/CD.

## Workflows

### CI (`ci.yml`)
Körs på varje push och pull request till `main` eller `develop` branches.
- Lint check med ESLint
- TypeScript type checking
- Build
- Tests med Vitest
- Körs på Node.js 18.x och 20.x

### Test (`test.yml`)
Separat workflow för att köra tester.
- Körs på Node.js 18.x och 20.x
- Bygger projektet
- Kör alla tester

### Lint (`lint.yml`)
Separat workflow för linting.
- ESLint check
- TypeScript type checking

### Publish (`publish.yml`)
Publicerar paketet till npm när en release skapas.
- Körs när en GitHub Release skapas
- Kan också köras manuellt med workflow_dispatch
- Bumpar version (patch/minor/major)
- Bygger projektet
- Publicerar till npm
- Skapar GitHub Release

**Setup krävs:**
- Lägg till `NPM_TOKEN` i repository secrets (npm access token)

### Deploy Documentation (`docs.yml`)
Publicerar dokumentationen till GitHub Pages.
- Körs när filer i `docs/` ändras
- Bygger Jekyll site
- Deployar till GitHub Pages

**Setup krävs:**
- Aktivera GitHub Pages i repository settings
- Välj "GitHub Actions" som source

## Secrets

För att workflows ska fungera behöver du konfigurera följande secrets:

### NPM_TOKEN
För att publicera till npm:
1. Skapa en npm access token på https://www.npmjs.com/settings/[your-username]/tokens
2. Lägg till som secret i repository: Settings → Secrets and variables → Actions → New repository secret
3. Namn: `NPM_TOKEN`
4. Värde: Din npm access token

## Användning

### Automatisk CI/CD
Alla workflows körs automatiskt när:
- Kod pushas till `main` eller `develop`
- Pull requests skapas mot `main` eller `develop`
- GitHub Releases skapas (för publish)

### Manuell publicering
För att publicera manuellt:
1. Gå till Actions i GitHub
2. Välj "Publish to npm"
3. Klicka "Run workflow"
4. Välj version (patch/minor/major)
5. Klicka "Run workflow"

