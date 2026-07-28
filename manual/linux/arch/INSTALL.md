# BlackSentinel Nexus FREE - Instalacion en Arch Linux

## Requisitos Previos

### 1. Actualizar sistema

```bash
sudo pacman -Syu
```

### 2. Instalar dependencias基本icas

```bash
sudo pacman -S git curl wget python
```

### 3. Instalar Node.js

```bash
sudo pacman -S nodejs npm

# Verificar
node --version
```

### 4. Instalar build tools

```bash
sudo pacman -S base-devel
```

### 5. Instalar pnpm

```bash
sudo npm install -g pnpm
```

---

## Instalacion del Sistema

```bash
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
pnpm install
pnpm build
pnpm start
```

---

## Verificacion

| Servicio | URL |
|----------|-----|
| Web UI | http://localhost:3000 |
| API | http://localhost:3001 |
| Docs | http://localhost:3001/docs |

**Login:** admin@blacksentinel.io / Admin@123

---

## Solucion de Problemas Arch

### Node.js muy viejo (AUR tiene versiones mas recientes)

```bash
# Instalar desde AUR
yay -S nodejs-lts-gallium

# O usar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
```

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
```

---

## Docker en Arch

```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

---

## Notas Arch

- Arch siempre tiene las versiones mas recientes de Node.js
- Si usas AUR, puedes buscar `nodejs-lts` para la ultima LTS
- No hay problemas de permisos si ejecutas como usuario normal
