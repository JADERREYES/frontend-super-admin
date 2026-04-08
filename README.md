# 🧠 MenteAmiga-AI - Panel de Super Administración

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

Panel de super administración para la plataforma de apoyo emocional MenteAmiga-AI. Diseñado para controlar y monitorear la plataforma sin afectar directamente la experiencia del usuario final.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Pantallas del Panel](#-pantallas-del-panel)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Consideraciones de Seguridad](#-consideraciones-de-seguridad)
- [Conexión con el Backend](#-conexión-con-el-backend)
- [Documentación Adicional](#-documentación-adicional)
- [Licencia](#-licencia)

---

## ✨ Características Principales

### 🎯 Funcionalidades Core

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Vista general con métricas, gráficos y alertas en tiempo real |
| **Usuarios** | Gestión completa de usuarios con filtros avanzados y visualización de estados |
| **Suscripciones** | Control de planes, facturación y estados de suscripción |
| **Alertas** | Monitoreo de riesgos de usuarios y eventos del sistema con niveles de severidad |
| **Documentos** | Administración de términos, políticas y guías de la plataforma |
| **Actividad** | Registro de auditoría completo de todas las acciones en el sistema |
| **Configuración** | Parámetros globales, seguridad, umbrales de IA y preferencias |

### 🎨 Diseño UX/UI

- ✅ **Desktop-first**: Diseño optimizado para laptops y tablets
- ✅ **Profesional y limpio**: Interfaz orientada a administradores
- ✅ **Responsive**: Adaptable a diferentes tamaños de pantalla
- ✅ **Modos de visualización**: Tablas, tarjetas, gráficos y paneles
- ✅ **Filtros avanzados**: Búsqueda y filtrado en todas las secciones
- ✅ **Privacidad por diseño**: Acceso limitado a información sensible de usuarios

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión 20.x o superior
- **npm**: Versión 10.x o superior (incluido con Node.js)
- **Git**: Para control de versiones

### Verificación de Instalación

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git (opcional)
git --version
```

---

## 🚀 Instalación

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd menteamiga-ai-admin
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias incluyendo:
- React 19.x
- TypeScript 5.x
- Recharts (gráficos)
- Lucide React (iconos)
- Tailwind CSS (estilos)

### Paso 3: Configurar Variables de Entorno

Crear un archivo `.env.development` para el entorno de desarrollo:

```env
# Backend API
VITE_API_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=10000

# Autenticación
VITE_JWT_SECRET=tu_clave_secreta_aqui
VITE_TOKEN_EXPIRY=3600

# Seguridad
VITE_ENABLE_2FA=true
VITE_MAX_LOGIN_ATTEMPTS=5

# Monitoreo
VITE_SENTRY_DSN=tu_sentry_dsn_aqui (opcional)
```

Para producción, crear `.env.production` con las variables correspondientes.

---

## 🔧 Ejecución

### Entorno de Desarrollo

```bash
npm run dev
```

El panel estará disponible en: `http://localhost:5173`

### Compilación para Producción

```bash
npm run build
```

Esto generará el directorio `dist/` con todos los archivos optimizados y listos para deploy.

### Previsualización de Producción

```bash
npm run preview
```

Permite probar la compilación de producción localmente en `http://localhost:4173`

### Linting y Type Checking

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Ejecutar linter (si está configurado)
npm run lint
```

---

## 📁 Estructura del Proyecto

```
menteamiga-ai-admin/
├── dist/                          # Archivos compilados (producción)
├── src/
│   ├── App.tsx                    # Componente principal - TODA la lógica del panel
│   ├── main.tsx                   # Punto de entrada de React
│   ├── index.css                  # Estilos globales y configuración Tailwind
│   └── utils/
│       └── cn.ts                  # Utilidad para clases condicionales
├── index.html                     # HTML base
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración TypeScript
├── vite.config.ts                 # Configuración Vite
├── DOCUMENTACION.md               # Documentación técnica detallada
└── README.md                      # Este archivo
```

### Arquitectura Actual

El proyecto utiliza una arquitectura monolítica en un solo archivo (`App.tsx`) por simplicidad de desarrollo inicial. Para escalabilidad, se recomienda modularizar en:

```
src/
├── components/                    # Componentes reutilizables
│   ├── ui/                       # Componentes de UI base
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchInput.tsx
│   │   ├── StatCard.tsx
│   │   └── Table.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── PrivateRoute.tsx
│   └── features/                 # Componentes por módulo
│       ├── dashboard/
│       ├── users/
│       ├── subscriptions/
│       ├── alerts/
│       ├── documents/
│       ├── activity/
│       └── settings/
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── useDashboard.ts
├── services/                     # Capa de servicios API
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── userService.ts
│   └── ...
├── store/                        # Estado global (opcional)
│   ├── authStore.ts
│   └── uiStore.ts
├── types/                        # Definiciones TypeScript
│   ├── index.ts
│   ├── user.ts
│   ├── subscription.ts
│   └── ...
└── utils/                        # Utilidades
    ├── constants.ts
    ├── formatters.ts
    └── validators.ts
```

---

## 🖥️ Pantallas del Panel

### 1. Login
- Acceso exclusivo para super administradores
- Validación de credenciales
- Mensajes de error informativos
- Bloqueo por intentos fallidos

### 2. Dashboard
- **Tarjetas de métricas**: Usuarios totales, sesiones hoy, ingresos, alertas
- **Gráficos interactivos**:
  - Actividad de la plataforma (últimos 12 meses)
  - Distribución de riesgo de usuarios
  - Tendencias de ingresos
- **Alertas recientes**: Listado de eventos críticos
- **Usuarios activos recientemente**: Vista rápida

### 3. Usuarios
- Tabla completa con búsqueda y filtros
- Columnas: ID, Nombre, Email, Estado, Riesgo, Suscripción, Última actividad
- Filtros por: estado, nivel de riesgo, tipo de suscripción
- Modal de detalle de usuario
- Botón de reporte con justificación obligatoria

### 4. Suscripciones
- Métricas: Ingresos mensuales, Tasa de renovación, Churn rate, Trial activos
- Distribución por plan (Gráfico de torta)
- Tabla de suscripciones con detalles de facturación
- Estados: Activo, Vencido, Cancelado, Prueba

### 5. Alertas
- Métricas por nivel de severidad
- Filtros por estado (Abierto, Investigando, Resuelto)
- Tabla con: Usuario, Severidad, Tipo, Descripción, Estado, Timestamp
- Acciones: Ver detalles, Cambiar estado, Cerrar alerta
- **Protocolo de emergencia** para alertas críticas

### 6. Documentos
- Gestión de: Términos del Servicio, Políticas de Privacidad, Guías Clínicas
- Control de versiones
- Estados: Publicado, Borrador, Archivado
- Acciones: Ver historial, Publicar, Archivar

### 7. Actividad (Auditoría)
- Registro completo de todas las acciones
- Columnas: Timestamp, Actor, Acción, Detalles, IP, Recurso
- Filtros por tipo de actor (Admin, Sistema, Usuario)
- Búsqueda por detalles
- Paginación

### 8. Configuración
- **General**: Nombre de la plataforma, Email de soporte, URL de términos
- **Seguridad**: 2FA obligatorio, IP whitelist, Días de expiración de token, Auditoría detallada
- **Umbrales de IA**: Riesgo suicida, Autolesión, Depresión severa, Ansiedad
- **Notificaciones**: Alertas por email, Webhooks, Reportes diarios
- **Apariencia**: Modo oscuro, Color primario

---

## 🛠️ Tecnologías Utilizadas

### Core Technologies
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.x | Librería principal para la interfaz |
| **TypeScript** | 5.x | Tipado estático y seguridad |
| **Vite** | 6.x | Bundler y herramienta de desarrollo |
| **Tailwind CSS** | 4.x | Framework de CSS utilitario |

### Librerías Adicionales
| Librería | Versión | Uso |
|----------|---------|-----|
| **Recharts** | 2.15.x | Visualización de gráficos y datos |
| **Lucide React** | 0.475.x | Iconos consistentes y ligeros |

### Herramientas de Desarrollo
- **TypeScript**: Para tipado seguro
- **ESLint**: Linting de código (configurable)
- **Prettier**: Formateo de código (opcional)

---

## 🔐 Consideraciones de Seguridad

### Principios Fundamentales

1. **Privacidad por Diseño**: El admin NO tiene acceso indiscriminado a conversaciones privadas
2. **Acceso Justificado**: Cualquier acceso a información sensible requiere justificación
3. **Auditoría Completa**: TODAS las acciones del admin son registradas
4. **Separación de Entornos**: Frontend admin independiente del frontend de usuario

### Datos que NUNCA debe ver el Admin
- ❌ Contenido completo de conversaciones usuario-IA
- ❌ Notas de usuario privadas
- ❌ Diarios personales
- ❌ Historial completo de chat sin justificación

### Datos que SÍ puede ver el Admin
- ✅ Datos de perfil básico (nombre, email, fecha registro)
- ✅ Estado de suscripción y facturación
- ✅ Métricas agregadas y anónimas
- ✅ Nivel de riesgo calculado por la IA
- ✅ Alertas generadas por el sistema

### Protocolo de Acceso Temporal
1. **Solicitud**: Admin solicita acceso especificando motivo
2. **Justificación Obligatoria**: Debe describir por qué necesita el acceso
3. **Registración**: Todo queda guardado en auditoría
4. **Tiempo Limitado**: Acceso solo por tiempo determinado
5. **Aprobación**: Puede requerir aprobación de otro admin (configurable)

### Recomendaciones de Implementación
- Usar HTTPS en producción
- Implementar JWT con refresh tokens
- Rate limiting en endpoints de login
- 2FA obligatorio para cuentas de admin
- IP whitelist para acceso al panel admin
- Logout automático por inactividad

---

## 🔗 Conexión con el Backend

### Arquitectura Recomendada

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Frontend Admin │  HTTPS  │  API Gateway    │  HTTPS  │  Backend Core   │
│  (React/Vite)   │◄───────►│  (Autenticación)│◄───────►│  (API REST)     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │  Base de Datos  │
                           │  (PostgreSQL)   │
                           └─────────────────┘
```

### Capa de Servicios API

Ejemplo de estructura para conectar con el backend:

```typescript
// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Intentar refresh token o redirigir a login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Endpoints Requeridos del Backend

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/admin/login` | Login de super admin | ❌ |
| POST | `/auth/admin/refresh` | Refresh token | ✅ |
| POST | `/auth/admin/logout` | Logout | ✅ |
| GET | `/admin/dashboard/stats` | Métricas del dashboard | ✅ |
| GET | `/admin/users` | Listar usuarios | ✅ |
| GET | `/admin/users/:id` | Obtener usuario por ID | ✅ |
| PUT | `/admin/users/:id/status` | Actualizar estado usuario | ✅ |
| GET | `/admin/subscriptions` | Listar suscripciones | ✅ |
| GET | `/admin/alerts` | Listar alertas | ✅ |
| PUT | `/admin/alerts/:id/status` | Actualizar estado alerta | ✅ |
| GET | `/admin/documents` | Listar documentos | ✅ |
| POST | `/admin/documents` | Crear documento | ✅ |
| GET | `/admin/activity` | Registro de auditoría | ✅ |
| GET | `/admin/settings` | Obtener configuración | ✅ |
| PUT | `/admin/settings` | Actualizar configuración | ✅ |
| POST | `/admin/audit/access-request` | Solicitar acceso temporal | ✅ |

### Headers de Seguridad Requeridos

```typescript
// Headers que debe enviar el frontend en cada petición
{
  'Authorization': 'Bearer <access_token>',
  'X-Admin-Panel': 'true',
  'X-Request-ID': '<uuid_para_trazabilidad>',
  'X-Forwarded-For': '<ip_del_cliente>'
}
```

---

## 📚 Documentación Adicional

Para información más detallada, consulta los siguientes recursos:

### 📄 DOCUMENTACION.md
Archivo con documentación técnica completa que incluye:
1. **Estructura detallada** del frontend-admin
2. **Descripción completa** de cada pantalla
3. **Componentes principales** con propiedades y variantes
4. **Flujo de navegación** y protección de rutas
5. **Cómo conectar** con el backend-core paso a paso
6. **Orden correcto de desarrollo** por fases
7. **Recomendaciones de diseño** para no afectar al usuario final
8. **Ejemplos de código** para servicios y hooks

### 🎨 Guías de Diseño
- **Tailwind CSS**: [Documentación oficial](https://tailwindcss.com/docs)
- **Recharts**: [Galería de ejemplos](https://recharts.org/en-US/examples)
- **Lucide Icons**: [Buscador de iconos](https://lucide.dev/icons/)

---

## 📋 Orden de Desarrollo Recomendado

### Fase 1: Configuración y Autenticación (Prioridad Alta)
1. Configurar proyecto base con Vite + React + TypeScript
2. Instalar y configurar Tailwind CSS
3. Implementar pantalla de Login
4. Crear contexto de autenticación
5. Implementar rutas protegidas

### Fase 2: Dashboard y Layout (Prioridad Alta)
1. Crear Layout principal (Sidebar + Header)
2. Implementar navegación entre pantallas
3. Crear componente Dashboard con métricas mock
4. Integrar gráficos con Recharts

### Fase 3: Módulos Core (Prioridad Media)
1. Módulo de Usuarios con tabla y filtros
2. Módulo de Suscripciones
3. Módulo de Alertas
4. Modal de detalle de usuario

### Fase 4: Módulos Secundarios (Prioridad Media)
1. Módulo de Documentos
2. Módulo de Actividad/Auditoría
3. Módulo de Configuración

### Fase 5: Integración y Seguridad (Prioridad Alta)
1. Conectar con backend real
2. Implementar refresh token
3. Agregar 2FA
4. Implementar IP whitelist
5. Auditoría completa de acciones

### Fase 6: Testing y Optimizaciones (Prioridad Baja)
1. Pruebas unitarias
2. Pruebas de integración
3. Optimizaciones de rendimiento
4. Pruebas de seguridad
5. Documentación final

---

## 🚀 Deploy y Producción

### Compilación
```bash
npm run build
```

Esto genera el directorio `dist/` con:
- Archivos minificados
- Assets optimizados
- Source maps (opcional)
- Index.html listo

### Servidores Recomendados
- **Vercel**: Deploy automático desde Git
- **Netlify**: Fácil configuración y CDN
- **AWS S3 + CloudFront**: Para escala empresarial
- **Nginx**: Servidor web tradicional

### Variables de Entorno de Producción
```env
VITE_API_URL=https://api.menteamiga.ai/api/v1
VITE_ENABLE_2FA=true
VITE_MAX_LOGIN_ATTEMPTS=3
```

---

## 📝 Notas Importantes

1. **Datos Mock**: Actualmente el panel usa datos mock para demostración. Reemplazar con llamadas a la API real.
2. **Privacidad**: Respetar siempre las políticas de privacidad y no acceder a información sensible sin justificación.
3. **Auditoría**: Todas las acciones deben ser registradas para cumplimiento normativo.
4. **Responsividad**: Aunque es desktop-first, probar en tamaños de tablet para asegurar usabilidad.
5. **Seguridad**: Nunca exponer tokens o credenciales en el código fuente. Usar variables de entorno.

---

## 🤝 Contribución

Para contribuir al proyecto:
1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📄 Licencia

Este proyecto es propiedad de **MenteAmiga-AI**. Todos los derechos reservados.

---

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@menteamiga.ai
- Documentación: Ver `DOCUMENTACION.md`

---

> ⚠️ **Recordatorio**: Este panel de administración es una herramienta poderosa. Úsalo con responsabilidad y siempre respetando la privacidad y confidencialidad de los usuarios de MenteAmiga-AI.

---

*Última actualización: 2026*
