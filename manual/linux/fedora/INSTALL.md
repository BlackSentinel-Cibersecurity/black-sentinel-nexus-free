# BlackSentinel Nexus FREE - Instalacion en Fedora

## Requisitos Previos

### 1. Actualizar sistema

```bash
sudo dnf upgrade -y
```

### 2. Instalar dependencias基本icas

```bash
sudo dnf install -y git curl wget python3
```

### 3. Instalar Node.js 20

```bash
# Usar modulo de Node.js
sudo dnf module install nodejs:20/common

# O via NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verificar
node --version
```

### 4. Instalar build tools

```bash
sudo dnf groupinstall -y "Development Tools"
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

**Login:** admin@blacksentinel.io / la contraseña que el API muestra una vez en su log al primer arranque (o tu `ADMIN_PASSWORD`)

---

## Solucion de Problemas Fedora

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

### Error better-sqlite3

```bash
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y python3
pnpm rebuild better-sqlite3
```

### SELinux bloquea conexiones

```bash
sudo setsebool -P httpd_can_network_connect 1
```

---

## Docker en Fedora

```bash
sudo dnf install -y docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

---

## Firewall en Fedora

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```
