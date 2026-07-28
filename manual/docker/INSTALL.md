# BlackSentinel Nexus FREE - Instalacion con Docker

Docker permite ejecutar el sistema en cualquier plataforma (Linux, macOS, Windows) sin instalar dependencias del sistema operativo.

---

## Requisitos Previos

### Instalar Docker Desktop

| Plataforma | Enlace |
|------------|--------|
| Windows | https://www.docker.com/products/docker-desktop |
| macOS | https://www.docker.com/products/docker-desktop |
| Linux | https://docs.docker.com/engine/install/ |

### Verificar instalacion

```bash
docker --version
docker-compose --version
```

---

## Instalacion

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
```

### Paso 2: Iniciar con Docker

```bash
docker-compose up -d
```

### Paso 3: Verificar que los contenedores estan corriendo

```bash
docker-compose ps
```

Deberia ver algo como:

```
NAME                STATUS          PORTS
bsn-api             Up              0.0.0.0:3001->3001/tcp
bsn-web             Up              0.0.0.0:3000->3000/tcp
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

## Comandos Docker

```bash
# Iniciar en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio especifico
docker-compose logs -f api
docker-compose logs -f web

# Detener servicios
docker-compose down

# Detener y eliminar volumenes
docker-compose down -v

# Reconstruir contenedores
docker-compose build --no-cache
docker-compose up -d

# Reiniciar servicios
docker-compose restart

# Ver estado
docker-compose ps
```

---

## Persistencia de Datos

La base de datos SQLite se almacena en un volumen Docker persistente:

```bash
# El volumen se crea automaticamente en el primer inicio
# Los datos persisten al detener/reiniciar contenedores

# Para eliminar datos (reset completo)
docker-compose down -v
docker-compose up -d
```

---

## Variables de Entorno

Puedes configurar variables creando un archivo `.env` en la raiz del proyecto:

```bash
# Crear archivo .env
cp .env.example .env

# Editar con tus configuraciones
nano .env
```

Variables disponibles:

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secreto JWT | (generado automaticamente) |
| `DATABASE_TYPE` | Tipo de BD | `sqlite` |
| `AI_API_KEY` | API key de OpenAI (opcional) | - |

---

## Actualizar a nueva version

```bash
# Descargar ultima version
git pull origin main

# Reconstruir contenedores
docker-compose build --no-cache

# Reiniciar
docker-compose down
docker-compose up -d
```

---

## Solucion de Problemas Docker

### Error: "Cannot connect to the Docker daemon"

**Linux:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

**macOS/Windows:**
- Abrir Docker Desktop
- Esperar a que este "Running"

### Error: "Port 3000 already in use"

```bash
# Detener todo primero
docker-compose down

# O cambiar puertos en docker-compose.yml
# Editar la seccion "ports:"
```

### Error: "no space left on device"

```bash
# Limpiar imagenes Docker no usadas
docker system prune -a

# Limpiar volumenes no usados
docker volume prune
```

### Los contenedores se reinician constantemente

```bash
# Ver logs del error
docker-compose logs api

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Error de permisos (Linux)

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Cerrar y abrir sesion nuevamente
```

---

## Docker Compose Personalizado

Si quieres configurar puertos diferentes o variables personalizadas:

```bash
# Crear docker-compose.override.yml
cat > docker-compose.override.yml << 'EOF'
version: '3.8'
services:
  api:
    ports:
      - '8080:3001'
    environment:
      - JWT_SECRET=mi-secreto-personalizado
  web:
    ports:
      - '80:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
EOF
```

---

## Notas Importantes

- Docker Desktop es gratuito para uso personal y pequenos negocios
- Los datos se persisten en volumenes Docker
- No necesita instalacion de Node.js o pnpm en el sistema host
- Funciona igual en Windows, macOS y Linux
- El primer inicio puede tardar 2-3 minutos
