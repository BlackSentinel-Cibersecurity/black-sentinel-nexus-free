# BlackSentinel Nexus FREE - Instalacion en Ubuntu / Linux Mint

## Requisitos Previos

### 1. Actualizar sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar dependencias基本icas

```bash
sudo apt install -y curl wget git build-essential python3
```

### 3. Instalar Node.js 20 LTS

```bash
# Agregar repositorio de NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

### 4. Instalar pnpm

```bash
npm install -g pnpm

# Verificar
pnpm --version
```

---

## Instalacion del Sistema

```bash
# Clonar repositorio
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free

# Instalar dependencias
pnpm install

# Construir proyecto
pnpm build

# Iniciar sistema
pnpm start
```

---

## Verificacion

Abrir Firefox o Chrome y acceder a:

| Servicio | URL |
|----------|-----|
| Web UI | http://localhost:3000 |
| API | http://localhost:3001 |
| Docs | http://localhost:3001/docs |

**Login:** admin@blacksentinel.io / Admin@123

---

## Solucion de Problemas Ubuntu

### Error EACCES

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Puerto en uso

```bash
sudo lsof -i :3001
sudo kill $(lsof -ti:3001)
# O: pnpm stop
```

### Error better-sqlite3

```bash
sudo apt install -y build-essential python3
pnpm rebuild better-sqlite3
```

### Firewall

```bash
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
```

---

## Docker en Ubuntu

```bash
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
# Cerrar y abrir sesion nuevamente

git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```
