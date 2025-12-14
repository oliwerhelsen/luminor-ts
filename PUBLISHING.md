# Publicering till npm

Denna guide beskriver hur man publicerar Luminor till npm.

## Förutsättningar

1. **npm-konto**
   - Skapa konto på https://www.npmjs.com/signup
   - Verifiera email-adressen

2. **npm access token**
   - Logga in på npm
   - Gå till: https://www.npmjs.com/settings/[your-username]/tokens
   - Klicka "Generate New Token"
   - Välj typ: **Automation** (viktigt för CI/CD)
   - Kopiera token (den visas bara en gång!)
   - Lägg till som GitHub Secret:
     - Repository → Settings → Secrets and variables → Actions
     - New repository secret
     - Namn: `NPM_TOKEN`
     - Värde: Din npm token

3. **Paketnamn**
   - Kontrollera att paketnamnet i `package.json` är unikt
   - Om `luminor` redan är taget, ändra till t.ex. `@your-username/luminor` eller `luminor-framework`

## Publicering

### Metod 1: Automatisk via GitHub Release

1. Bumpa versionen lokalt:
   ```bash
   npm version patch  # eller minor, major
   git push
   git push --tags
   ```

2. Skapa GitHub Release:
   - Gå till repository → Releases → "Create a new release"
   - Välj tag (t.ex. `v0.1.0`)
   - Fyll i release notes
   - Klicka "Publish release"
   - Workflow körs automatiskt och publicerar till npm

### Metod 2: Manuell via GitHub Actions

1. Gå till Actions i GitHub
2. Välj "Publish to npm"
3. Klicka "Run workflow"
4. Välj version bump (patch/minor/major)
5. Klicka "Run workflow"
6. Workflow kommer att:
   - Bumpa versionen
   - Pusha till git
   - Bygga projektet
   - Publicera till npm

### Metod 3: Lokal publicering (för test)

```bash
# Bygg projektet
npm run build

# Testa publicering (dry-run)
npm publish --dry-run

# Publicera
npm publish --access public
```

## Felsökning

### "NPM_TOKEN secret is not set"
- Lägg till `NPM_TOKEN` i repository secrets
- Se instruktioner ovan

### "Version already exists on npm"
- Versionen finns redan på npm
- Bumpa versionen först:
  ```bash
  npm version patch
  git push
  git push --tags
  ```

### "Package name already taken"
- Paketnamnet är redan taget
- Ändra `name` i `package.json` till något unikt
- T.ex. `@your-username/luminor`

### "You do not have permission to publish"
- Du är inte inloggad på npm
- Kör: `npm login`
- Eller kontrollera att NPM_TOKEN är korrekt

### "Invalid token"
- NPM_TOKEN är fel eller utgången
- Skapa en ny token och uppdatera secret

### Workflow körs inte
- Kontrollera att workflow-filen är korrekt
- Kontrollera att du pushar till rätt branch
- Kontrollera Actions tab för felmeddelanden

## Verifiera publicering

Efter publicering kan du verifiera:

```bash
# Kolla om paketet finns
npm view luminor

# Kolla specifik version
npm view luminor@0.1.0

# Installera och testa
npm install -g luminor
luminor --version
```

Eller besök: https://www.npmjs.com/package/luminor

## Versionshantering

Följ [Semantic Versioning](https://semver.org/):
- **PATCH** (0.1.0 → 0.1.1): Bugfixes
- **MINOR** (0.1.0 → 0.2.0): Nya features (bakåtkompatibelt)
- **MAJOR** (0.1.0 → 1.0.0): Breaking changes

## Checklista före publicering

- [ ] Alla tester passerar (`npm test`)
- [ ] Linting passerar (`npm run lint`)
- [ ] Projektet bygger utan fel (`npm run build`)
- [ ] Versionen är korrekt i `package.json`
- [ ] CHANGELOG.md är uppdaterad
- [ ] README.md är uppdaterad
- [ ] NPM_TOKEN är satt i GitHub Secrets
- [ ] Paketnamnet är unikt på npm

