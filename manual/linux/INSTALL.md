# BlackSentinel Nexus FREE - Instalacion en Linux (General)

Esta guia aplica para cualquier distribucion de Linux. Para guias especificas por distro, consulta las carpetas correspondientes.

---

## Requisitos Previos

### 1. Instalar Git

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install -y git

# Fedora
sudo dnf install -y git

# CentOS/RHEL
sudo yum install -y git

# Arch/Manjaro
sudo pacman -S git
```

### 2. Instalar Node.js

```bash
# Debian/Ubuntu (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf module install nodejs:20/common

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Arch/Manjaro
sudo pacman -S nodejs npm
```

### 3. Instalar pnpm

```bash
npm install -g pnpm
```

### Verificar instalacion

```bash
node --version    # Debe mostrar v18+ o v20+
pnpm --version    # Debe mostrar 9.0+
git --version     # Cualquier version reciente
```

---

## Instalacion del Sistema

### Paso 1: Abrir Terminal

- Buscar "Terminal" en el menu de aplicaciones
- O presionar `Ctrl + Alt + T` (en la mayoria de distros)

### Paso 2: Clonar el repositorio

```bash
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
```

### Paso 3: Instalar dependencias

```bash
pnpm install
```

### Paso 4: Construir el proyecto

```bash
pnpm build
```

### Paso 5: Iniciar el sistema

```bash
pnpm start
```

---

## Verificacion

Abrir el navegador (Firefox, Chrome, etc.) y acceder a:

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
| Contrasena | La `ADMIN_PASSWORD` de tu `.env` (`./scripts/init-env.sh`) o la que el API muestra una vez en su log al primer arranque |

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

## Solucion de Problemas en Linux

### Error: "command not found: pnpm"

```bash
# Recargar PATH
source ~/.bashrc
# O para zsh
source ~/.zshrc
```

### Error: "Permission denied" o EACCES

```bash
# Solucion temporal
sudo chown -R $(whoami) ~/.npm

# Solucion permanente
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Error: "Port 3001 already in use"

```bash
# Ver que proceso usa el puerto
sudo lsof -i :3001

# Matar el proceso
sudo kill $(lsof -ti:3001)

# O simplemente
pnpm stop
```

### Error: "EACCES" al crear archivos

```bash
# Verificar permisos del directorio
ls -la

# Si es necesario
sudo chown -R $(whoami) /ruta/al/proyecto
```

### Error de compilacion con better-sqlite3

```bash
# Instalar herramientas de compilacion

# Debian/Ubuntu
sudo apt install -y build-essential python3

# Fedora
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y python3

# CentOS/RHEL
sudo yum groupinstall -y "Development Tools"
sudo yum install -y python3

# Arch/Manjaro
sudo pacman -S base-devel python
```

### El sistema no responde

```bash
# Detener todo
pnpm stop

# Limpiar
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# Reinstalar
pnpm install
pnpm build
pnpm start
```

### Error: "Module not found" despues de actualizar

```bash
# Limpiar cache de pnpm
pnpm store prune
rm -rf node_modules
pnpm install
pnpm build
```

---

## Ejecutar como Servicio Systemd (Opcional)

Para que el sistema se inicie automaticamente al iniciar la sesion:

### Paso 1: Crear archivo de servicio

```bash
sudo nano /etc/systemd/system/blacksentinel.service
```

### Paso 2: Pegar el contenido

```ini
[Unit]
Description=BlackSentinel Nexus FREE
After=network.target

[Service]
Type=simple
User=TU_USUARIO
WorkingDirectory=/ruta/a/black-sentinel-nexus-free
ExecStart=/usr/bin/node scripts/start.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Paso 3: Activar e iniciar

```bash
sudo systemctl daemon-reload
sudo systemctl enable blacksentinel
sudo systemctl start blacksentinel

# Ver estado
sudo systemctl status blacksentinel

# Ver logs
sudo journalctl -u blacksentinel -f
```

---

## Firewall de Linux

### Ubuntu/Debian (UFW)

```bash
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw reload
```

### Fedora/CentOS (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

### Arch (iptables)

```bash
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
```

---

## Instalacion con Docker en Linux

### Paso 1: Instalar Docker

```bash
# Debian/Ubuntu
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# Fedora
sudo dnf install -y docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# Arch
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

### Paso 2: Clonar e instalar

```bash
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

---

## Notas Adicionales

- Todos los scripts funcionan igual en todas las distribuciones de Linux
- El sistema crea automaticamente el archivo `.env` en el primer inicio
- SQLite se instala automaticamente via `better-sqlite3`
- No se necesita root/sudo para la instalacion normal
