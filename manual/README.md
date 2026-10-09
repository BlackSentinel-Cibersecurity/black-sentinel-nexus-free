# BlackSentinel Nexus FREE - Manual de Uso

## Indice

| Plataforma | Archivo |
|------------|---------|
| [General (todos los SO)](./README.md) | Este archivo |
| [Windows](./windows/INSTALL.md) | Guia completa para Windows |
| [macOS](./macos/INSTALL.md) | Guia completa para macOS |
| [Linux (General)](./linux/INSTALL.md) | Guia para cualquier distro Linux |
| [Ubuntu / Linux Mint](./linux/ubuntu/INSTALL.md) | Guia especifica Ubuntu |
| [Debian](./linux/debian/INSTALL.md) | Guia especifica Debian |
| [Kali Linux](./linux/kali/INSTALL.md) | Guia especifica Kali |
| [BlackArch](./linux/blackarch/INSTALL.md) | Guia especifica BlackArch |
| [Fedora](./linux/fedora/INSTALL.md) | Guia especifica Fedora |
| [CentOS / RHEL](./linux/centos/INSTALL.md) | Guia especifica CentOS |
| [Arch Linux](./linux/arch/INSTALL.md) | Guia especifica Arch |
| [Manjaro](./linux/manjaro/INSTALL.md) | Guia especifica Manjaro |
| [Docker (Cualquier SO)](./docker/INSTALL.md) | Guia con Docker |

---

## Que es BlackSentinel Nexus?

BlackSentinel Nexus es una plataforma de operaciones de seguridad (SIEM) de nueva generacion con:

- Monitoreo de eventos de seguridad en tiempo real
- Gestion e investigacion de incidentes
- Inventario de activos y calculo de riesgo
- Inteligencia de amenazas
- Correlacion de eventos con IA
- Automatizacion de respuesta (SOAR)
- Visualizacion Digital Twin en 3D
- Interfaz web moderna con graficos en tiempo real

**Edicion FREE:** Maximo 3 usuarios, 10 conectores, 2 reglas de correlacion, solo EN/ES.

---

## Requisitos Minimos

| Componente | Minimo | Recomendado |
|------------|--------|-------------|
| Node.js | 18+ | 20 LTS |
| pnpm | 9.0+ | 9.0+ |
| RAM | 2 GB | 4 GB+ |
| Disco | 500 MB | 1 GB+ |
| OS | Windows 10+, macOS 12+, Linux (cualquier distro) | - |

---

## Instalacion Rapida (Cualquier SO)

```bash
# 1. Clonar el repositorio
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free

# 2. Instalar dependencias
pnpm install

# 3. Construir el proyecto
pnpm build

# 4. Iniciar el sistema
pnpm start
```

**Listo!** El sistema estara disponible en:
- Web: http://localhost:3000
- API: http://localhost:3001
- Login: admin@blacksentinel.io / la contraseña que el API muestra una vez en su log al primer arranque (o tu `ADMIN_PASSWORD`)

---

## Instalacion con Docker (Cualquier SO)

```bash
# 1. Clonar el repositorio
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free

# 2. Iniciar con Docker
docker-compose up -d
```

**Listo!** Misma disponibilidad que la instalacion local.

---

## Comandos Disponibles

| Comando | Descripcion |
|---------|-------------|
| `pnpm install` | Instalar dependencias |
| `pnpm build` | Construir todos los paquetes |
| `pnpm dev` | Iniciar en modo desarrollo |
| `pnpm start` | Iniciar en modo produccion |
| `pnpm stop` | Detener todos los servidores |
| `pnpm reset-db` | Resetear base de datos |
| `pnpm lint` | Verificar codigo |
| `pnpm typecheck` | Verificar tipos TypeScript |

---

## Estructura del Proyecto

```
black-sentinel-nexus-free/
  apps/
    api/              # Backend NestJS (puerto 3001)
    web/              # Frontend Next.js (puerto 3000)
  packages/
    types/            # Tipos TypeScript compartidos
    ui/               # Componentes React compartidos
    shared/           # Utilidades compartidas
    config/           # Configuracion centralizada
  scripts/            # Scripts cross-platform (Node.js)
  manual/             # Esta documentacion
  docker-compose.yml  # Despliegue Docker
```

---

## Credenciales por Defecto

| Campo | Valor |
|-------|-------|
| Email | admin@blacksentinel.io |
| Contrasena | La `ADMIN_PASSWORD` de tu `.env` (`./scripts/init-env.sh`) o la que el API muestra una vez en su log al primer arranque |

**IMPORTANTE:** Cambia la contrasena despues del primer inicio.

---

## Solucion de Problemas

### El puerto 3001 ya esta en uso

```bash
# Linux/macOS
kill $(lsof -ti:3001)

# Windows (PowerShell)
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# O usar el script incluido
pnpm stop
```

### Error de permisos (Linux/macOS)

```bash
sudo chown -R $(whoami) ~/.npm
```

### Error de compilacion

```bash
# Limpiar y reconstruir
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
pnpm build
```

### Base de datos corrupta

```bash
pnpm reset-db
pnpm start
```

---

## Soporte

- **Issues:** https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free/issues
- **Email:** admin@blacksentinel.io
