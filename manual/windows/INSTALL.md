# BlackSentinel Nexus FREE - Instalacion en Windows

## Requisitos Previos

### 1. Instalar Git

**Opcion A - Git for Windows (recomendado):**
1. Descargar desde https://git-scm.com/download/win
2. Ejecutar el instalador
3. Seleccionar opciones por defecto
4. Verificar: `git --version` en PowerShell

**Opcion B - Via winget:**
```powershell
winget install Git.Git
```

**Opcion C - Via Chocolatey:**
```powershell
choco install git
```

### 2. Instalar Node.js

**Opcion A - Instalador oficial:**
1. Descargar LTS desde https://nodejs.org/
2. Ejecutar el instalador
3. Verificar: `node --version` en PowerShell

**Opcion B - Via winget:**
```powershell
winget install OpenJS.NodeJS.LTS
```

**Opcion C - Via Chocolatey:**
```powershell
choco install nodejs-lts
```

### 3. Instalar pnpm

Abrir PowerShell como administrador y ejecutar:

```powershell
npm install -g pnpm
```

Verificar: `pnpm --version`

---

## Instalacion del Sistema

### Paso 1: Abrir PowerShell

- Presionar `Win + X` y seleccionar "Windows PowerShell" o "Terminal"
- O buscar "PowerShell" en el menu inicio

### Paso 2: Navegar al directorio deseado

```powershell
cd C:\
# O cualquier directorio donde quieras instalar el sistema
cd C:\Users\TuUsuario\Documents
```

### Paso 3: Clonar el repositorio

```powershell
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
```

### Paso 4: Instalar dependencias

```powershell
pnpm install
```

### Paso 5: Construir el proyecto

```powershell
pnpm build
```

### Paso 6: Iniciar el sistema

```powershell
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

```powershell
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

## Solucion de Problemas en Windows

### Error: "command not found: pnpm"

Cerrar y abrir PowerShell, o ejecutar:
```powershell
refreshenv
```

### Error: "EACCES" o permisos

Ejecutar PowerShell como administrador.

### Error: "Port 3001 already in use"

```powershell
# Ver que proceso usa el puerto
netstat -ano | findstr :3001

# Matar el proceso (reemplazar <PID> con el numero)
taskkill /F /PID <PID>

# O simplemente
pnpm stop
```

### Error: "EPERM: operation not permitted"

1. Desactivar temporalmente el antivirus
2. Ejecutar PowerShell como administrador
3. Ejecutar: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Error de compilacion con better-sqlite3

```powershell
# Instalar herramientas de compilacion
npm install -g windows-build-tools

# O instalar Visual Studio Build Tools
winget install Microsoft.VisualStudio.2022.BuildTools
```

### El sistema no responde

```powershell
# Detener todo
pnpm stop

# Limpiar
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\api\node_modules
Remove-Item -Recurse -Force apps\web\node_modules

# Reinstalar
pnpm install
pnpm build
pnpm start
```

---

## Firewall de Windows

Si Windows Firewall bloquea las conexiones:

1. Abrir "Windows Defender Firewall"
2. Hacer clic en "Permitir una aplicacion a traves del Firewall"
3. Buscar "Node.js" y permitir en redes privadas/publicas

---

## Instalacion con Docker en Windows

### Paso 1: Instalar Docker Desktop

1. Descargar Docker Desktop desde https://www.docker.com/products/docker-desktop
2. Ejecutar el instalador
3. Reiniciar el equipo
4. Verificar: `docker --version`

### Paso 2: Clonar e instalar

```powershell
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

---

## Notas Adicionales

- Todos los scripts (`pnpm build`, `pnpm start`, `pnpm stop`) funcionan igual en Windows
- No se necesitan scripts bash ni WSL
- Git Bash tambien es compatible si prefieres una terminal Unix-like
- El sistema crea automaticamente el archivo `.env` en el primer inicio
