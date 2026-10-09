# BlackSentinel Nexus FREE - Instalacion en Kali Linux

## Nota Importante

Kali Linux ya incluye Node.js y herramientas de desarrollo preinstaladas. La instalacion es mas rapida que en otras distros.

---

## Requisitos Previos

### 1. Verificar Node.js (ya instalado)

```bash
node --version    # Debe mostrar v18+ o v20+
npm --version
```

Si no esta instalado o es muy viejo:
```bash
sudo apt update
sudo apt install -y nodejs npm
```

### 2. Instalar Git (ya instalado)

```bash
git --version
```

### 3. Instalar pnpm

```bash
sudo npm install -g pnpm
```

### 4. Instalar build tools (si no estan)

```bash
sudo apt install -y build-essential python3
```

---

## Instalacion del Sistema

```bash
# Clonar repositorio
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free

# Instalar dependencias
pnpm install

# Construir
pnpm build

# Iniciar
pnpm start
```

---

## Verificacion

| Servicio | URL |
|----------|-----|
| Web UI | http://localhost:3000 |
| API | http://localhost:3001 |
| Docs | http://localhost:3001/docs |

**Login:** admin@blacksentinel.io / la contraseña que el API muestra una vez en su log al primer arranque (o tu `ADMIN_PASSWORD`)

---

## Solucion de Problemas Kali

### Node.js muy viejo (Kali 2022 o anterior)

```bash
# Instalar version moderna via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Error EACCES

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Puerto en uso

```bash
sudo lsof -i :3001
sudo kill $(lsof -ti:3001)
```

### Error better-sqlite3

```bash
sudo apt install -y build-essential python3
pnpm rebuild better-sqlite3
```

---

## Docker en Kali

```bash
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

---

## Notas para Kali

- Kali usa zsh por defecto, asegurate de que el PATH este configurado
- Si usas como root, los permisos no son problema
- El sistema es util para analisis de seguridad y pentesting
