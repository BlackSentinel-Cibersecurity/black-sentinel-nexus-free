# BlackSentinel Nexus FREE - Instalacion en macOS

## Requisitos Previos

### 1. Instalar Homebrew (si no lo tienes)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar Git

```bash
brew install git
```

Verificar: `git --version`

### 3. Instalar Node.js

```bash
brew install node@20
brew link node@20
```

O usar nvm para gestionar multiples versiones:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20
```

Verificar: `node --version`

### 4. Instalar pnpm

```bash
npm install -g pnpm
```

Verificar: `pnpm --version`

---

## Instalacion del Sistema

### Paso 1: Abrir Terminal

- Presionar `Cmd + Space` y buscar "Terminal"
- O ir a Applications > Utilities > Terminal

### Paso 2: Navegar al directorio deseado

```bash
cd ~/Documents
# O cualquier directorio donde quieras instalar
```

### Paso 3: Clonar el repositorio

```bash
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
```

### Paso 4: Instalar dependencias

```bash
pnpm install
```

### Paso 5: Construir el proyecto

```bash
pnpm build
```

### Paso 6: Iniciar el sistema

```bash
pnpm start
```

---

## Verificacion

Abrir el navegador y acceder a:

| Servicio | URL |
|----------|-----|
| Interfaz Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Documentacion API | http://localhost:3001/docs |
| Health Check | http://localhost:3001/api/v1/health |

### Login por Defecto

| Campo | Valor |
|-------|-------|
| Email | admin@blacksentinel.io |
| Contrasena | Admin@123 |

---

## Comandos Utiles

```bash
# Iniciar en modo desarrollo
pnpm dev

# Detener servidores
pnpm stop

# Resetear base de datos
pnpm reset-db

# Reconstruir todo
pnpm build

# Verificar codigo
pnpm lint
```

---

## Solucion de Problemas en macOS

### Error: "command not found: pnpm"

Cerrar y abrir la Terminal, o ejecutar:
```bash
source ~/.zshrc
```

### Error: "Permission denied" o EACCES

```bash
sudo chown -R $(whoami) ~/.npm
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Error: "Port 3001 already in use"

```bash
# Ver que proceso usa el puerto
lsof -i :3001

# Matar el proceso
kill $(lsof -ti:3001)

# O simplemente
pnpm stop
```

### Error de compilacion con better-sqlite3

```bash
# Instalar Xcode Command Line Tools
xcode-select --install

# Si persiste
sudo xcode-select --reset
```

### Error: "Cannot find module" despues de instalar

```bash
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
pnpm build
```

### El sistema no responde

```bash
# Detener todo
pnpm stop

# Limpiar caches
rm -rf node_modules
pnpm store prune
pnpm install
pnpm build
pnpm start
```

---

## macOS con Apple Silicon (M1/M2/M3)

El sistema funciona nativamente en Apple Silicon. Si hay problemas con `better-sqlite3`:

```bash
# Forzar construccion nativa
arch -arm64 pnpm rebuild better-sqlite3
```

---

## Instalacion con Docker en macOS

### Paso 1: Instalar Docker Desktop

1. Descargar Docker Desktop desde https://www.docker.com/products/docker-desktop
2. Seleccionar la version Apple Silicon o Intel segun tu Mac
3. Arrastrar a Applications
4. Verificar: `docker --version`

### Paso 2: Clonar e instalar

```bash
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

---

## Firewall de macOS

Si macOS bloquea las conexiones:

1. Ir a System Settings > Network > Firewall
2. Hacer clic en Options
3. Buscar "node" y permitir conexiones entrantes

---

## Notas Adicionales

- Todos los scripts funcionan igual en macOS (Intel y Apple Silicon)
- El sistema crea automaticamente el archivo `.env` en el primer inicio
- SQLite se instala automaticamente via `better-sqlite3`
- Si usas zsh (default en macOS moderno), los PATH se actualizan automaticamente
