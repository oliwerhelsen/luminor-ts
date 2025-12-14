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
Publicerar paketet till npm när en release skapas eller manuellt.
- Körs när en GitHub Release skapas
- Kan också köras manuellt med workflow_dispatch
- Bumpar version (patch/minor/major) vid manuell körning
- Bygger projektet
- Verifierar att versionen inte redan finns på npm
- Publicerar till npm

**Setup krävs:**
- Lägg till `NPM_TOKEN` i repository secrets (npm access token)

**Användning:**
1. **Automatisk publicering via Release:**
   - Skapa en GitHub Release med tag (t.ex. `v1.0.0`)
   - Workflow körs automatiskt och publicerar till npm

2. **Manuell publicering:**
   - Gå till Actions → "Publish to npm"
   - Klicka "Run workflow"
   - Välj version bump (patch/minor/major)
   - Workflow bumpar versionen, pushar till git, och publicerar till npm

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
1. Logga in på npm: https://www.npmjs.com/login
2. Gå till: https://www.npmjs.com/settings/[your-username]/tokens
3. Klicka "Generate New Token" → "Automation"
4. Kopiera token (den visas bara en gång!)
5. Lägg till som secret i repository:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Namn: `NPM_TOKEN`
   - Värde: Din npm access token
6. Klicka "Add secret"

**Viktigt:**
- Token måste vara av typen "Automation" för att fungera med CI/CD
- Token behöver ha rättigheter att publicera paket

## Felsökning

### Publicering fungerar inte

1. **Kontrollera att NPM_TOKEN är satt:**
   - Gå till Settings → Secrets → Actions
   - Verifiera att `NPM_TOKEN` finns

2. **Kontrollera att paketnamnet är unikt:**
   - Paketnamnet i `package.json` måste vara unikt på npm
   - Om namnet redan finns, ändra det i `package.json`

3. **Kontrollera att versionen inte redan finns:**
   - Workflow kontrollerar automatiskt om versionen redan finns
   - Om den finns, bumpa versionen först

4. **Kontrollera workflow logs:**
   - Gå till Actions → Välj workflow run
   - Kolla loggarna för felmeddelanden

### Workflow körs inte

1. **Kontrollera triggers:**
   - Release workflow: Skapas en GitHub Release?
   - Manual workflow: Körs via workflow_dispatch?

2. **Kontrollera branch:**
   - Vissa workflows körs bara på `main` branch

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

Workflow kommer att:
1. Bumpa versionen i package.json
2. Pusha ändringarna till git
3. Bygga projektet
4. Publicera till npm
