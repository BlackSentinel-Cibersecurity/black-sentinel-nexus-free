# BlackSentinel Nexus FREE - Instalacion en BlackArch

## Nota Importante

BlackArch ya incluye la mayoria de herramientas de desarrollo. Node.js puede necesitar actualizacion.

---

## Requisitos Previos

### 1. Actualizar sistema

```bash
sudo pacman -Syu
```

### 2. Instalar Node.js

```bash
sudo pacman -S nodejs npm
```

### 3. Instalar build tools

```bash
sudo pacman -S base-devel python
```

### 4. Instalar pnpm

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

**Login:** admin@blacksentinel.io / la contraseña que el API muestra una vez en su log al primer arranque (o tu `ADMIN_PASSWORD`)

---

## Solucion de Problemas BlackArch

### Node.js muy viejo

```bash
# Usar nvm para gestionar versiones
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
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

## Docker en BlackArch

```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

---

## Notas para BlackArch

- BlackArch usa bash por defecto
- La mayoria de herramientas ya estan preinstaladas
- Si ejecutas como root, no hay problemas de permisos
- Ideal para usar como herramienta de analisis de seguridad
