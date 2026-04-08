# Documentación - Panel de Super Administración MenteAmiga-AI

## 1. Estructura del Frontend-Admin

### 1.1 Arquitectura General
El panel de super administración de MenteAmiga-AI está construido con una arquitectura de componentes React moderna, utilizando TypeScript para mayor seguridad y mantenibilidad.

```
src/
├── App.tsx               # Componente principal con todas las pantallas
├── main.tsx              # Punto de entrada de la aplicación
├── index.css             # Estilos globales
└── utils/
    └── cn.ts             # Utilidades para manejo de clases Tailwind
```

### 1.2 Tecnologías Principales
- **React 19**: Framework de UI con hooks modernos
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS 4**: Framework de utilidades CSS para estilos responsive
- **Recharts**: Biblioteca de visualización de datos para gráficos interactivos
- **Lucide React**: Conjunto de iconos consistentes y personalizables

### 1.3 Patrones de Diseño Implementados
- **Layout Responsivo**: Diseño desktop-first con adaptación a tablet
- **Componentización**: Modularización de UI en componentes reutilizables
- **State Management**: Estado local con useState y useMemo para optimización
- **Routing Condicional**: Navegación entre pantallas sin necesidad de librerías adicionales

---

## 2. Pantallas Necesarias

### 2.1 Pantalla de Login (`LoginPage`)
- **Propósito**: Acceso exclusivo para super administradores
- **Características**:
  - Formulario de autenticación con email y contraseña
  - Validación de credenciales con feedback visual
  - Mensajes de error informativos
  - Indicador de carga durante el proceso de login
  - Diseño seguro y profesional

### 2.2 Dashboard General (`DashboardPage`)
- **Propósito**: Vista general de métricas y actividad de la plataforma
- **Características**:
  - **Tarjetas de Estadísticas**:
    - Usuarios totales y tendencia
    - Sesiones de chat del día
    - Ingresos mensuales (MRR)
    - Alertas activas pendientes
  - **Gráficos Interactivos**:
    - Actividad de la plataforma (últimos 7 días)
    - Distribución de niveles de riesgo
    - Ingresos vs MRR (últimos 6 meses)
    - Distribución de suscripciones
  - **Alertas Recientes**: Listado de las alertas más importantes
  - **Accesos Rápidos**: Acciones frecuentes

### 2.3 Gestión de Usuarios (`UsersPage`)
- **Propósito**: Administrar y monitorear a los usuarios de la plataforma
- **Características**:
  - **Filtros Avanzados**:
    - Por estado (todos, activo, suspendido, pendiente)
    - Por nivel de riesgo (todos, bajo, medio, alto, crítico)
    - Por suscripción (todos, free, basic, premium, enterprise)
  - **Búsqueda**: Por nombre, email o ID de usuario
  - **Tabla de Usuarios**:
    - Información básica (nombre, email)
    - Estado de la cuenta
    - Nivel de riesgo (con colores distintivos)
    - Tipo de suscripción
    - Última actividad
    - Fecha de registro
    - Número de sesiones
  - **Acciones**: Ver detalles, editar, suspender/activar
  - **Modal de Detalle**: Visualización completa de la información del usuario
  - **Privacidad**: Cumplimiento de políticas de protección de datos

### 2.4 Gestión de Suscripciones (`SubscriptionsPage`)
- **Propósito**: Controlar y monitorear las suscripciones de los usuarios
- **Características**:
  - **Métricas Principales**:
    - Ingresos mensuales (MRR)
    - Número de suscriptores activos
    - Tasa de cancelación (churn)
    - Próximas renovaciones
  - **Gráficos**:
    - Distribución de suscripciones por plan
    - Distribución por ciclo de facturación
  - **Tabla de Suscripciones**:
    - Nombre del usuario
    - Plan contratado
    - Estado de la suscripción
    - Ciclo de facturación
    - Monto
    - Fecha de inicio
    - Próximo cobro
  - **Filtros**: Por estado y por plan
  - **Búsqueda**: Por nombre de usuario

### 2.5 Gestión de Alertas (`AlertsPage`)
- **Propósito**: Monitorear y gestionar alertas de seguridad, sistema y riesgo
- **Características**:
  - **Estadísticas de Alertas**:
    - Críticas (prioridad máxima)
    - Altas (prioridad alta)
    - Medias (prioridad media)
    - Bajas (prioridad baja)
  - **Filtros**:
    - Por severidad (todas, crítica, alta, media, baja)
    - Por estado (todas, abierta, investigando, resuelta)
    - Por tipo (seguridad, sistema, usuario, suscripción)
  - **Tabla de Alertas**:
    - Tipo de alerta
    - Severidad (con colores distintivos)
    - Título descriptivo
    - Estado
    - Fecha de creación
    - Asignado a
  - **Acciones**: Ver detalles, cambiar estado, asignar
  - **Protocolos de Emergencia**: Indicaciones para alertas críticas
  - **Privacidad**: Cumplimiento de políticas sobre acceso a información

### 2.6 Gestión de Documentos (`DocumentsPage`)
- **Propósito**: Administrar documentos legales y guías de la plataforma
- **Características**:
  - **Métricas Rápidas**: Documentos publicados, borradores, archivados
  - **Filtros**:
    - Por categoría (todos, términos, privacidad, FAQ, guías, seguridad)
    - Por estado (todos, publicado, borrador, archivado)
  - **Búsqueda**: Por título del documento
  - **Tabla de Documentos**:
    - Título
    - Categoría
    - Versión
    - Estado
    - Última actualización
    - Autor
  - **Acciones**: Ver, editar, eliminar, crear nuevo

### 2.7 Auditoría y Actividad (`ActivityPage`)
- **Propósito**: Registrar y monitorear todas las acciones en la plataforma
- **Características**:
  - **Resumen de Actividad**:
    - Acciones totales hoy
    - Acciones de administradores
    - Eventos del sistema
    - Acciones de usuarios
  - **Filtros**:
    - Por tipo de actor (todos, admin, sistema, usuario)
    - Por tipo de acción
  - **Búsqueda**: Por ID de recurso o detalles
  - **Tabla de Logs**:
    - Timestamp completo
    - Acción realizada
    - Actor
    - Tipo de actor
    - Recurso afectado
    - Dirección IP (si aplica)
    - Detalles adicionales

### 2.8 Configuración Global (`SettingsPage`)
- **Propósito**: Configurar parámetros generales del sistema
- **Características**:
  - **Pestañas Organizadas**:
    - **General**: Configuración básica de la plataforma
    - **Seguridad**: Parámetros de autenticación y acceso
    - **Riesgo**: Umbrales de detección de riesgo para la IA
    - **Notificaciones**: Preferencias de alertas
    - **Apariencia**: Tema y personalización del panel
  - **Toggle Components**: Interruptores para activar/desactivar funcionalidades
  - **Sliders**: Ajuste de parámetros numéricos
  - **Inputs**: Configuración de texto y números
  - **Banners de Advertencia**: Para cambios críticos

---

## 3. Componentes Principales

### 3.1 Componentes de UI Reutilizables

#### Badge (`Badge`)
- **Propósito**: Mostrar estados, categorías o niveles de forma visual
- **Variantes**:
  - `success`: Verde para estados positivos (activo, publicado, resuelto)
  - `warning`: Amarillo para advertencias (pendiente, investigando)
  - `danger`: Rojo para alertas (crítico, suspendido, vencido)
  - `info`: Azul para información (básico, premium)
  - `neutral`: Gris para estados neutros (free, archivado)
  - `pending`: Amarillo claro para pendientes

#### StatCard (`StatCard`)
- **Propósito**: Mostrar métricas clave con contexto visual
- **Características**:
  - Título descriptivo
  - Valor numérico destacado
  - Tendencia (aumento/disminución vs período anterior)
  - Icono representativo con fondo de color

#### Pagination (`Pagination`)
- **Propósito**: Navegar por conjuntos de datos paginados
- **Características**:
  - Números de página
  - Botones anterior/siguiente
  - Indicador de página actual
  - Deshabilitación de botones en límites

#### SearchInput (`SearchInput`)
- **Propósito**: Campo de búsqueda con icono integrado
- **Características**:
  - Icono de lupa a la izquierda
  - Placeholder personalizable
  - Estilos consistentes con el diseño del panel

#### Toggle (Componente Interno)
- **Propósito**: Interruptor para activar/desactivar funcionalidades
- **Características**:
  - Estado visual claro (activado/desactivado)
  - Animación suave de transición
  - Fácil integración con formularios

### 3.2 Componentes de Layout

#### Modal (`Modal`)
- **Propósito**: Mostrar contenido superpuesto para acciones específicas
- **Características**:
  - Overlay semitransparente
  - Título en la cabecera
  - Botón de cierre (X)
  - Área de contenido scrolleable
  - Botones de acción en el pie
  - Cierre al clickear fuera del modal

#### Sidebar (Integrado en App)
- **Propósito**: Navegación principal del panel
- **Características**:
  - Colapsable/expandible (desktop)
  - Deslizante desde la izquierda (mobile)
  - Items de navegación con iconos
  - Badges para indicar elementos pendientes
  - Estado activo resaltado
  - Botón de cerrar sesión

#### Header (Integrado en App)
- **Propósito**: Cabecera superior con información y acciones
- **Características**:
  - Breadcrumb de navegación
  - Campo de búsqueda rápida
  - Botón de notificaciones
  - Botón de actualización
  - Perfil de usuario
  - Botón de menú móvil
  - Botón para colapsar sidebar

---

## 4. Flujo de Navegación

### 4.1 Flujo Principal

```
┌─────────────────────────────────────────────────────────────┐
│                    Pantalla de Login                         │
│  (Acceso inicial - validación de credenciales de admin)     │
└─────────────────────────┬───────────────────────────────────┘
                          │ Login exitoso
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Principal                        │
│  (Vista general - métricas, gráficos, alertas recientes)   │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌──────────┐    ┌──────────────┐    ┌────────────────┐
   │  Users   │    │ Subscriptions│    │   Documents    │
   │ (Gestión │    │  (Planes y   │    │ (Legales y    │
   │ Usuarios)│    │  Facturación)│    │   Guías)       │
   └──────────┘    └──────────────┘    └────────────────┘
          │               │                   │
          └───────────────┼───────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌──────────┐    ┌──────────────┐    ┌────────────────┐
   │  Alerts  │    │   Activity   │    │   Settings     │
   │ (Alertas │    │ (Auditoría y │    │ (Configuración │
   │  Riesgo) │    │   Registro)  │    │    Global)     │
   └──────────┘    └──────────────┘    └────────────────┘
```

### 4.2 Navegación por Sidebar
- **Items Principales**: Dashboard, Usuarios, Suscripciones, Documentos, Alertas, Actividad, Configuración
- **Badges**: El item "Alertas" muestra el número de alertas pendientes
- **Estado Activo**: El item correspondiente a la pantalla actual se resalta visualmente
- **Colapsibilidad**: En desktop, el sidebar puede colapsarse para mostrar solo iconos
- **Móvil**: En dispositivos móviles, el sidebar se desliza desde la izquierda con un botón

### 4.3 Navegación por Header
- **Breadcrumb**: Muestra la ruta actual (ej: Dashboard / Usuarios)
- **Búsqueda Rápida**: Campo para buscar usuarios, suscripciones o documentos
- **Notificaciones**: Botón con indicador de nuevas alertas
- **Actualización**: Botón para refrescar datos de la pantalla actual
- **Perfil**: Muestra el nombre y rol del administrador

### 4.4 Acciones de Navegación
- **Click en Sidebar**: Navega a la pantalla correspondiente
- **Cerrar Sesión**: Muestra modal de confirmación y retorna al login
- **Botones de Acción en Tablas**: Navegan a modales de detalle o realizan acciones
- **Actualización**: Recarga los datos de la pantalla actual

---

## 5. Cómo Conectarlo con el Backend-Core

### 5.1 Arquitectura de Conexión

```
┌─────────────────┐         HTTPS          ┌─────────────────┐
│  Frontend-Admin │◄──────────────────────►│  Backend-Core   │
│  (React + TS)   │   JWT Authentication   │   (API REST)    │
└─────────────────┘   Headers Seguros      └─────────────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │   Base de Datos │
                                       │  (PostgreSQL)   │
                                       └─────────────────┘
```

### 5.2 Autenticación y Seguridad

#### 5.2.1 JWT (JSON Web Token)
- **Flujo de Autenticación**:
  1. El admin ingresa email y contraseña en el login
  2. Frontend envía credenciales por HTTPS al endpoint `/api/admin/auth/login`
  3. Backend valida credenciales y genera un **JWT de admin** con claims específicos
  4. Frontend almacena el JWT en:
     - **`localStorage`**: Para persistencia entre sesiones (con cuidado)
     - **Memoria**: Para acceso rápido durante la sesión
  5. En cada request subsiguiente, el JWT se envía en el header:
     ```http
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

- **Claims Recomendados para el JWT**:
  ```json
  {
    "sub": "admin-uuid-123",
    "email": "admin@menteamiga.com",
    "role": "SUPER_ADMIN",
    "permissions": ["users:read", "users:write", "alerts:manage", "settings:edit"],
    "iat": 1704067200,
    "exp": 1704153600,
    "iss": "menteamiga-backend",
    "aud": "menteamiga-admin-panel"
  }
  ```

#### 5.2.2 Refresh Token
- **Problema**: JWT tiene tiempo de expiración corto (seguridad)
- **Solución**: Implementar refresh token con vida más larga
- **Flujo**:
  1. Al login exitoso, backend devuelve `access_token` (JWT, 15min) y `refresh_token` (24h)
  2. Cuando el `access_token` está por expirar, frontend envía el `refresh_token` a `/api/admin/auth/refresh`
  3. Backend valida el refresh token y emite un nuevo `access_token`
  4. Si el refresh token también expiró, el admin debe reautenticarse

#### 5.2.3 Headers de Seguridad
```typescript
// Configuración base de headers para API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.menteamiga.com';

const createApiHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('admin_access_token');
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    // Prevención contra CSRF (si usas cookies)
    'X-CSRF-Token': getCsrfToken(),
  };
};
```

### 5.3 Estructura de Servicios API

#### 5.3.1 Service Layer (Capa de Servicios)
```typescript
// src/services/apiClient.ts
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...createApiHeaders(),
        ...options.headers,
      },
      credentials: 'same-origin', // Para cookies CSRF
    });

    if (response.status === 401) {
      // Token expirado - intentar refresh o redirigir a login
      handleUnauthorized();
      throw new Error('No autorizado');
    }

    if (response.status === 403) {
      // Permisos insuficientes
      throw new Error('Permisos insuficientes para esta acción');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: Omit<RequestInit, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: Omit<RequestInit, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: Omit<RequestInit, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: Omit<RequestInit, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL || 'https://api.menteamiga.com');
```

#### 5.3.2 Servicios Específicos

```typescript
// src/services/authService.ts
import { apiClient } from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/admin/auth/login', credentials);
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    return apiClient.post('/api/admin/auth/refresh', { refresh_token: refreshToken });
  },

  async logout(): Promise<void> {
    // Opcional: notificar al backend para invalidar tokens
    await apiClient.post('/api/admin/auth/logout');
    // Limpiar storage
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
  },

  async getCurrentAdmin(): Promise<{ id: string; email: string; name: string; role: string }> {
    return apiClient.get('/api/admin/auth/me');
  },
};
```

```typescript
// src/services/usersService.ts
import { apiClient } from './apiClient';

// Tipos (podrían estar en src/types/)
export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  subscription: 'free' | 'basic' | 'premium' | 'enterprise';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActive: string | null;
  joinDate: string;
  sessionsCount: number;
  // NO incluir conversaciones privadas directamente
}

export interface UsersListResponse {
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: Record<string, string | undefined>;
}

export interface UserFilterParams {
  search?: string;
  status?: string;
  riskLevel?: string;
  subscription?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const usersService = {
  async getUsers(filters?: UserFilterParams): Promise<UsersListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return apiClient.get<UsersListResponse>(
      `/api/admin/users${queryString ? `?${queryString}` : ''}`
    );
  },

  async getUserById(id: string): Promise<User & { activitySummary: object }> {
    return apiClient.get(`/api/admin/users/${id}`);
  },

  async updateUserStatus(id: string, status: 'active' | 'suspended'): Promise<User> {
    // Esta acción debe quedar registrada en auditoría
    return apiClient.put(`/api/admin/users/${id}/status`, { status });
  },

  async getUserRiskHistory(id: string): Promise<Array<{ date: string; level: string; reason: string }>> {
    // Historial de riesgo SIN contenido de conversaciones
    return apiClient.get(`/api/admin/users/${id}/risk-history`);
  },
};
```

```typescript
// src/services/alertsService.ts
import { apiClient } from './apiClient';

export interface Alert {
  id: string;
  type: 'security' | 'system' | 'user' | 'subscription';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  assignedTo?: string;
  // Si está relacionado con usuario, SOLO el ID, no datos sensibles
  relatedUserId?: string;
  // Fragmento limitado SI es necesario para soporte (reglas estrictas)
  limitedContext?: string;
  hasSensitiveContent: boolean; // Indica si hay contenido que requiere aprobación
}

export const alertsService = {
  async getAlerts(filters?: {
    severity?: string;
    status?: string;
    type?: string;
    page?: number;
  }): Promise<{ data: Alert[]; pagination: object }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return apiClient.get(`/api/admin/alerts${params.size ? `?${params}` : ''}`);
  },

  async updateAlertStatus(id: string, status: Alert['status']): Promise<Alert> {
    return apiClient.put(`/api/admin/alerts/${id}/status`, { status });
  },

  async assignAlert(id: string, adminId: string): Promise<Alert> {
    return apiClient.put(`/api/admin/alerts/${id}/assign`, { adminId });
  },

  // Solo para casos de emergencia - requiere justificación
  async requestLimitedContext(alertId: string, reason: string): Promise<{ context: string; expiresAt: string }> {
    return apiClient.post(`/api/admin/alerts/${alertId}/request-context`, { reason });
  },
};
```

```typescript
// src/services/activityService.ts
import { apiClient } from './apiClient';

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorType: 'admin' | 'system' | 'user';
  resource: string;
  ip?: string;
  details: string;
}

export const activityService = {
  async getLogs(filters?: {
    actorType?: string;
    action?: string;
    search?: string;
    page?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: ActivityLog[]; pagination: object; summary: object }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return apiClient.get(`/api/admin/activity${params.size ? `?${params}` : ''}`);
  },

  async logAdminAction(action: string, resource: string, details: string): Promise<void> {
    // Llamada interna para registrar acciones del admin actual
    await apiClient.post('/api/admin/activity/log', { action, resource, details });
  },
};
```

### 5.4 Integración con el Estado de la App

#### 5.4.1 Auth Context (React Context)
```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al montar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        try {
          const adminData = await authService.getCurrentAdmin();
          setUser(adminData as AdminUser);
        } catch {
          // Token inválido - limpiar
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      // Guardar tokens
      localStorage.setItem('admin_access_token', response.access_token);
      localStorage.setItem('admin_refresh_token', response.refresh_token);
      
      setUser({
        ...response.admin,
        permissions: ['users:read', 'users:write', 'alerts:manage', 'settings:edit'], // Podría venir del backend
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Ignorar errores de logout en backend
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const checkPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    // Super admin tiene todos los permisos
    if (user.role === 'SUPER_ADMIN') return true;
    return user.permissions?.includes(permission) ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      checkPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 5.4.2 Data Fetching con React Query (Recomendado)
Para un manejo más robusto de datos, caching y sincronización, se recomienda integrar **React Query** (TanStack Query):

```typescript
// Instalación: npm install @tanstack/react-query

// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, UserFilterParams } from '../services/usersService';

export const useUsers = (filters?: UserFilterParams) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    keepPreviousData: true, // Para transiciones suaves entre páginas
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) =>
      usersService.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      // Registrar en actividad
      // activityService.logAdminAction(...)
    },
  });
};
```

### 5.5 Variables de Entorno

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_MOCK_DATA=true

# .env.production
VITE_API_BASE_URL=https://api.menteamiga.com
VITE_ENABLE_MOCK_DATA=false
```

---

## 6. Orden Correcto de Desarrollo

### Fase 1: Configuración y Estructura Base (Prioridad Alta)

#### Paso 1.1: Configuración del Proyecto
1. Inicializar proyecto con Vite + React + TypeScript
2. Instalar dependencias base:
   ```bash
   npm install react react-dom
   npm install -D typescript @types/react @types/react-dom
   ```
3. Configurar TypeScript (`tsconfig.json`)
4. Instalar y configurar Tailwind CSS 4
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```
5. Configurar Vite (`vite.config.ts`)
6. Configurar variables de entorno (`.env`)

#### Paso 1.2: Estructura de Carpetas
```
src/
├── components/        # Componentes UI reutilizables
│   ├── ui/           # Componentes base (Button, Badge, Modal, etc.)
│   ├── layout/       # Componentes de layout (Sidebar, Header, etc.)
│   └── features/     # Componentes específicos por módulo
├── contexts/         # React Contexts (Auth, Theme, etc.)
├── hooks/            # Custom hooks
├── services/         # Capa de servicios API
├── types/            # Definiciones de tipos TypeScript
├── utils/            # Funciones utilitarias
├── pages/            # Componentes de página
├── App.tsx           # Componente principal
├── main.tsx          # Punto de entrada
└── index.css         # Estilos globales
```

#### Paso 1.3: Sistema de Diseño Base
1. **Tema de Colores**: Definir paleta consistente (primario, secundario, estados de riesgo)
2. **Tipografía**: Establecer jerarquía (fuentes, tamaños, pesos)
3. **Componentes Base**:
   - Badge (variantes de estado)
   - Button (tamaños, variantes)
   - Input (formularios)
   - Card (contenedores)
   - Modal (superposiciones)
   - Spinner/Loading (indicadores de carga)
   - Table (estructura básica)

### Fase 2: Autenticación y Seguridad (Prioridad Alta)

#### Paso 2.1: Pantalla de Login
1. Implementar formulario de login con validación
2. Crear estados de UI (loading, error)
3. Implementar diseño visual

#### Paso 2.2: Context de Autenticación
1. Crear `AuthContext` con manejo de estado
2. Implementar métodos: `login()`, `logout()`, `checkAuth()`
3. Manejo de tokens en localStorage
4. Protección de rutas

#### Paso 2.3: Integración con API Auth
1. Crear `authService` para endpoints de autenticación
2. Implementar manejo de refresh token
3. Manejar errores de autenticación (401, 403)
4. Interceptor de requests para incluir JWT

#### Paso 2.4: Layout Principal
1. **Sidebar**: Navegación colapsable con items
2. **Header**: Breadcrumb, búsqueda rápida, perfil
3. **Router**: Sistema de navegación entre pantallas
4. **Protección**: Redirigir a login si no está autenticado

### Fase 3: Core Functionality (Prioridad Alta)

#### Paso 3.1: Dashboard
1. **StatCard Component**: Tarjetas de métricas reutilizables
2. **Gráficos**: Configurar Recharts con datos mock
3. **Layout**: Organizar widgets en grid responsive
4. **Datos Mock**: Crear conjuntos de datos realistas

#### Paso 3.2: Gestión de Usuarios
1. **Tabla de Usuarios**: Componente de tabla con columnas
2. **Filtros**: Componentes de filtrado (estado, riesgo, suscripción)
3. **Búsqueda**: Input de búsqueda con debounce
4. **Paginación**: Componente de paginación
5. **Modal de Detalle**: Visualización de información del usuario

#### Paso 3.3: Alertas
1. **Tabla de Alertas**: Con severidad y estados
2. **Badges de Severidad**: Colores diferenciados
3. **Filtros**: Por severidad, estado, tipo
4. **Acciones**: Cambiar estado, asignar

### Fase 4: Módulos Adicionales (Prioridad Media)

#### Paso 4.1: Suscripciones
1. **Métricas**: MRR, churn, suscriptores activos
2. **Tabla**: Datos de facturación y planes
3. **Gráficos**: Distribución por plan

#### Paso 4.2: Documentos
1. **Tabla de Documentos**: Versiones, estados, categorías
2. **Filtros**: Por categoría y estado
3. **Acciones**: CRUD básico

#### Paso 4.3: Actividad/Auditoría
1. **Tabla de Logs**: Timestamp, actor, acción, detalles
2. **Filtros**: Por tipo de actor, fecha
3. **Resumen**: Estadísticas de actividad

#### Paso 4.4: Configuración
1. **Pestañas**: Organizar configuraciones por categoría
2. **Toggle Component**: Interruptores para funcionalidades
3. **Sliders**: Ajuste de parámetros
4. **Formularios**: Inputs para configuraciones

### Fase 5: Integración y Polishing (Prioridad Media)

#### Paso 5.1: Integración API Completa
1. Reemplazar datos mock por llamadas a servicios reales
2. Implementar React Query para caching y sincronización
3. Manejar estados de loading y error en todas las pantallas
4. Implementar reintentos para requests fallidos

#### Paso 5.2: Experiencia de Usuario
1. **Loading States**: Indicadores visuales durante carga
2. **Error Handling**: Mensajes amigables y acciones de recovery
3. **Confirmations**: Modales de confirmación para acciones destructivas
4. **Notifications**: Sistema de toast para feedback de acciones

#### Paso 5.3: Responsividad
1. **Tablet**: Ajustar layouts para tablet (sidebar colapsado por defecto)
2. **Mobile**: Asegurar funcionalidad básica (aunque no sea la experiencia principal)
3. **Testing**: Pruebas en diferentes tamaños de pantalla

#### Paso 5.4: Privacidad y Cumplimiento
1. **Audit Logs**: Registrar TODAS las acciones de admin
2. **Access Controls**: Verificar permisos en cada acción
3. **Data Minimization**: Solo mostrar datos necesarios
4. **No Access a Conversaciones**: Asegurar que no haya acceso indiscriminado

### Fase 6: Testing y Deploy (Prioridad Alta)

#### Paso 6.1: Testing Básico
1. **Unit Tests**: Componentes clave y utilidades
2. **Integration Tests**: Flujos principales (login, navegación)
3. **E2E Tests**: Flujos críticos (gestión de usuarios, alertas)

#### Paso 6.2: Optimizaciones
1. **Code Splitting**: Lazy loading de páginas pesadas
2. **Bundle Analysis**: Identificar dependencias innecesarias
3. **Performance**: Lighthouse audit

#### Paso 6.3: Deploy
1. **Build**: `npm run build` para generar `dist/`
2. **Environment Variables**: Configurar variables de producción
3. **Deploy**: Subir `dist/` a hosting (Vercel, Netlify, S3, etc.)
4. **Domain**: Configurar subdominio específico (admin.menteamiga.com)
5. **SSL**: Certificado SSL válido
6. **Security Headers**: Configurar CSP, X-Frame-Options, etc.

---

## 7. Recomendaciones de Diseño para Admin sin Afectar al Usuario Final

### 7.1 Principios Fundamentales

#### Separación Estricta de Entornos
```
┌─────────────────────────────────────────────────────────────────┐
│                     SEPARACIÓN DE ENTORNOS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌──────────────────────┐         ┌──────────────────────┐    │
│   │   Frontend Usuario   │         │   Frontend Admin     │    │
│   │   (mobile-first)     │         │   (desktop-first)    │    │
│   │   app.menteamiga.com │         │   admin.menteamiga.com│   │
│   └──────────┬───────────┘         └──────────┬───────────┘    │
│              │                                  │                 │
│              │       ┌──────────────────┐      │                 │
│              │       │   Backend Core   │      │                 │
│              └──────►│  (API Unificada) │◄─────┘                 │
│                      │                  │                        │
│                      │  • Rutas Admin:  │                        │
│                      │    /api/admin/*  │                        │
│                      │                  │                        │
│                      │  • Rutas Usuario:│                        │
│                      │    /api/user/*   │                        │
│                      └────────┬─────────┘                        │
│                               │                                  │
│                      ┌────────▼─────────┐                        │
│                      │   Base de Datos  │                        │
│                      │   (Tablas con    │                        │
│                      │    permisos)     │                        │
│                      └──────────────────┘                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Recomendaciones Clave:

1. **Subdominios Diferentes**:
   - Usuario: `app.menteamiga.com` o `menteamiga.app`
   - Admin: `admin.menteamiga.com` (NUNCA compartir el mismo dominio)

2. **Rutas API Separadas**:
   - Endpoints de usuario: `/api/user/*`
   - Endpoints de admin: `/api/admin/*`
   - **Middleware Diferente**: Cada conjunto de rutas debe tener su propio middleware de autenticación y autorización

3. **Tokens Diferentes**:
   - JWT de usuario y JWT de admin deben ser **totalmente diferentes**:
     - Diferentes `secret` para firmar
     - Diferentes `audience` (audiencia)
     - Diferentes claims de rol
   - **Nunca** reutilizar el mismo token para ambos tipos de acceso

---

### 7.2 Privacidad de Datos de Usuario

#### Principio de Mínimo Privilegio
El panel admin debe cumplir con el **Principio de Mínimo Privilegio** y el **Derecho a la Intimidad** de los usuarios.

#### Datos que SÍ Puede Ver el Admin:
✅ **Datos demográficos básicos**:
   - Nombre
   - Email de contacto
   - Fecha de registro
   - Última actividad

✅ **Datos de suscripción**:
   - Plan contratado
   - Estado de pago
   - Historial de facturación (sin datos de tarjeta)

✅ **Datos de actividad agregados**:
   - Número de sesiones
   - Frecuencia de uso
   - Tiempo total de uso
   - Funcionalidades más utilizadas

✅ **Datos de riesgo LIMITADOS**:
   - Nivel de riesgo actual (bajo, medio, alto, crítico)
   - Historial de cambios de riesgo
   - **PERO NO**: El contenido exacto que generó la alerta

#### Datos que NUNCA Debe Ver el Admin:
❌ **Conversaciones privadas completas**:
   - El acceso a historiales de chat debe estar **prohibido por defecto**
   - Solo en casos excepcionales y con autorización

❌ **Contenido de diarios personales**:
   - Si la app tiene funcionalidad de diario, es **100% privado**

❌ **Datos de salud mental sensibles**:
   - Diagnósticos autorreportados
   - Evaluaciones de salud detalladas

❌ **Credenciales de usuario**:
   - Contraseñas (deben estar hasheadas)
   - Tokens de acceso

#### Acceso Temporal y Justificado (Para Emergencias)
Si por seguridad o soporte es NECESARIO acceder a información limitada:

```
┌─────────────────────────────────────────────────────────────────┐
│               PROTOCOLO DE ACCESO TEMPORAL                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Paso 1: El admin identifica una alerta CRÍTICA de riesgo      │
│                                                                   │
│  Paso 2: El admin solicita acceso contextual indicando:         │
│          • ID de la alerta                                       │
│          • Razón justificada                                     │
│          • Tiempo estimado necesario                             │
│                                                                   │
│  Paso 3: El sistema registra la solicitud en auditoría          │
│          • Timestamp completo                                     │
│          • ID del admin                                           │
│          • Razón ingresada                                        │
│                                                                   │
│  Paso 4: Si se aprueba (automático o manual):                   │
│          • Acceso LIMITADO a fragmento relevante                 │
│          • Solo lo necesario para evaluar el riesgo             │
│          • Duración limitada (ej: 15 minutos)                   │
│          • Marca de agua con ID del admin                        │
│                                                                   │
│  Paso 5: Todo acceso queda registrado permanentemente            │
│          • Qué se vio                                             │
│          • Cuándo se vio                                          │
│          • Por cuánto tiempo                                      │
│          • Acciones realizadas durante el acceso                 │
│                                                                   │
│  NOTA: En caso de riesgo de vida, el acceso puede ser           │
│        automático PERO queda todo registrado para auditoría      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7.3 Arquitectura de Seguridad

#### Middleware de Autorización de Admin
```typescript
// Ejemplo de middleware (en backend)
interface AdminAuthMiddlewareOptions {
  requirePermission?: string;
  logAction?: boolean;
  rateLimit?: boolean;
}

const adminAuthMiddleware = (options: AdminAuthMiddlewareOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Verificar que el token sea de ADMIN (no de usuario)
    const token = extractToken(req.headers.authorization);
    const payload = verifyAdminToken(token); // Lanza error si es token de usuario

    // 2. Verificar rol de super admin
    if (payload.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    // 3. Verificar permiso específico si se requiere
    if (options.requirePermission) {
      if (!payload.permissions?.includes(options.requirePermission)) {
        // Registrar intento fallido en auditoría
        await logFailedAttempt({
          adminId: payload.sub,
          action: options.requirePermission,
          reason: 'Permiso faltante',
          ip: req.ip,
        });
        return res.status(403).json({ error: 'Permiso específico requerido' });
      }
    }

    // 4. Rate limiting para endpoints admin
    if (options.rateLimit) {
      const isRateLimited = await checkAdminRateLimit(payload.sub);
      if (isRateLimited) {
        return res.status(429).json({ error: 'Demasiadas solicitudes' });
      }
    }

    // 5. Adjuntar datos del admin al request
    req.admin = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions,
    };

    // 6. Registrar acción si se requiere
    if (options.logAction) {
      res.on('finish', async () => {
        if (res.statusCode < 400) {
          await logAdminAction({
            adminId: payload.sub,
            action: req.method + ' ' + req.path,
            resource: req.params.id || 'N/A',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            success: true,
          });
        }
      });
    }

    next();
  };
};
```

#### Endpoints Protegidos Ejemplo
```typescript
// Rutas de admin - TODAS protegidas por el middleware
router.use('/api/admin/*', adminAuthMiddleware());

// Ejemplos de endpoints con permisos específicos
router.get(
  '/api/admin/users',
  adminAuthMiddleware({ 
    requirePermission: 'users:read', 
    logAction: true,
    rateLimit: true 
  }),
  getUsersHandler
);

router.put(
  '/api/admin/users/:id/status',
  adminAuthMiddleware({ 
    requirePermission: 'users:write', 
    logAction: true 
  }),
  updateUserStatusHandler
);

// Endpoint MUY sensible - requiere justificación
router.post(
  '/api/admin/alerts/:id/request-context',
  adminAuthMiddleware({ 
    requirePermission: 'alerts:context', 
    logAction: true 
  }),
  requestLimitedContextHandler
);
```

---

### 7.4 Auditoría Completa

#### Todo lo que Debe Registrarse:
| Categoría | Eventos a Registrar |
|-----------|---------------------|
| **Autenticación** | Login exitoso/fallido, logout, refresh token, intentos sospechosos |
| **Gestión Usuarios** | Ver usuario, editar datos, suspender/activar, cambiar suscripción |
| **Alertas** | Crear, asignar, cambiar estado, solicitar contexto, ver datos sensibles |
| **Configuración** | Cualquier cambio en parámetros globales, umbrales de riesgo, seguridad |
| **Documentos** | Crear, editar, publicar, archivar documentos legales |
| **Acceso Sensible** | Cualquier solicitud de información privada de usuarios |
| **Exportación** | Cada vez que se exportan datos de la plataforma |

#### Campos del Log de Auditoría:
```typescript
interface AdminAuditLog {
  id: string;
  timestamp: Date;
  
  // Quién
  adminId: string;
  adminEmail: string;
  adminRole: string;
  
  // Qué
  action: string;           // Ej: "USER_SUSPEND", "ALERT_CONTEXT_REQUEST"
  resourceType: string;     // Ej: "USER", "ALERT", "SETTING"
  resourceId: string;       // ID del recurso afectado
  
  // Detalles
  details: string;          // JSON string con datos adicionales
  reason?: string;          // Justificación para acciones sensibles
  
  // Contexto técnico
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  
  // Resultado
  success: boolean;
  errorMessage?: string;
  
  // Para acceso sensible
  accessDuration?: number;  // Duración en segundos (si aplica)
  dataAccessed?: string[];  // Lista de campos específicos accedidos
}
```

---

### 7.5 Recomendaciones UI/UX Específicas

#### 1. Transparencia sobre Privacidad
- **En cada pantalla que muestre datos de usuario**, incluir un banner discreto pero claro:
  > "Estos datos están protegidos por políticas de privacidad. Toda acción queda registrada."

- **En la sección de alertas de riesgo**:
  > "Las alertas se generan automáticamente. El contenido específico de las conversaciones no es accesible sin justificación."

#### 2. Confirmaciones Dobles para Acciones Destructivas
```
┌─────────────────────────────────────────┐
│  ⚠️  Confirmar Suspensión de Usuario    │
├─────────────────────────────────────────┤
│                                         │
│  Estás a punto de SUSPENDER a:         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Ana Martínez                   │    │
│  │  ana@example.com                │    │
│  │  Usuario Premium - Riesgo Alto  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Esta acción:                           │
│  • Impedirá el acceso a su cuenta      │
│  • Detendrá su suscripción activa      │
│  • Quedará REGISTRADA en auditoría     │
│                                         │
│  Motivo (requerido):                    │
│  ┌─────────────────────────────────┐    │
│  │ [Violación de términos y      ] │    │
│  │  condiciones del servicio     ] │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Escribe "SUSPENDER" para confirmar:    │
│  ┌─────────────────────────────────┐    │
│  │ [_____________________________] │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Cancelar]            [Confirmar]      │
│                                         │
└─────────────────────────────────────────┘
```

#### 3. Indicadores Visuales de Sensibilidad
- **Badge de "Datos Sensibles"**:
  ```
  [ Información Sensible - Solo para Emergencias ]
  ```

- **Color Diferenciado**: Secciones con datos sensibles deben tener un borde o fondo distintivo (ej: rojo claro)

- **Marca de Agua**: En pantallas que muestran información privada, agregar marca de agua con:
  - ID del admin
  - Timestamp actual
  - "Uso autorizado solo para soporte/seguridad"

#### 4. Limitación de Acciones en Masa
- **NO permitir**:
  - Suspender más de 5 usuarios a la vez
  - Cambiar suscripciones en lote sin aprobación
  - Exportar más de 100 registros sin justificación

- **Sí permitir**:
  - Cambios individuales con confirmación
  - Acciones en lote SOLO para administradores autorizados específicamente

---

### 7.6 Ejemplos de Implementación Correcta

#### ✅ Ejemplo Bueno: Visualización de Riesgo
```
┌──────────────────────────────────────────────────────────────┐
│  Nivel de Riesgo: 🔴 Crítico                                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Historial de Cambios:                                       │
│  ┌────────────┬──────────┬────────────────────────────────┐ │
│  │ Fecha      │ Nivel    │ Razón (Sistema)                │ │
│  ├────────────┼──────────┼────────────────────────────────┤ │
│  │ 2024-01-15 │ Crítico  │ Palabras clave de riesgo       │ │
│  │            │          │ detectadas + patrón de         │ │
│  │            │          │ desesperanza                    │ │
│  ├────────────┼──────────┼────────────────────────────────┤ │
│  │ 2024-01-10 │ Alto     │ Mención de ideación pasiva     │ │
│  ├────────────┼──────────┼────────────────────────────────┤ │
│  │ 2024-01-01 │ Medio    │ Aumento significativo de       │ │
│  │            │          │ conversaciones sobre tristeza   │ │
│  └────────────┴──────────┴────────────────────────────────┘ │
│                                                              │
│  ⓘ El contenido específico de las conversaciones NO es     │
│     accesible sin solicitud de contexto justificada.        │
│                                                              │
│  [📋 Solicitar Contexto Limitado]  [✓ Marcar como Atendido]│
└──────────────────────────────────────────────────────────────┘
```

#### ❌ Ejemplo Malo: Acceso Indiscriminado
```
┌──────────────────────────────────────────────────────────────┐
│  Historial de Chat de Ana Martínez                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [15/01 14:30] Ana: "No tengo ganas de seguir adelante..."  │
│  [15/01 14:31] IA: "¿Puedes contarme más sobre lo que..."  │
│  [15/01 14:32] Ana: "He pensado en formas de terminar..."   │
│  [15/01 14:33] IA: "Preocupado por escucharte decir eso..." │
│  ...                                                          │
│                                                              │
│  [Exportar Todo el Historial]  [Ver Todas las Conversaciones]│
└──────────────────────────────────────────────────────────────┘
```
**PROBLEMA**: Acceso completo sin restricciones ni justificación.

---

### 7.7 Checklist de Cumplimiento

#### Antes de Lanzar:
- [ ] **Separación**: Frontend admin en subdominio diferente al de usuarios
- [ ] **Autenticación**: JWT diferente para admin vs usuario
- [ ] **Middleware**: Todos los endpoints admin protegidos por autorización
- [ ] **Permisos**: Sistema granular de permisos por acción
- [ ] **Auditoría**: TODAS las acciones de admin quedan registradas
- [ ] **Rate Limit**: Límites de request específicos para admin
- [ ] **Confirmaciones**: Acciones destructivas requieren confirmación doble
- [ ] **Transparencia**: Banners informando sobre privacidad en secciones sensibles
- [ ] **No Conversaciones**: No hay acceso a historiales de chat completos
- [ ] **Acceso Limitado**: Sistema de solicitud de contexto justificado para emergencias
- [ ] **Logs Retención**: Política clara de retención de logs de auditoría
- [ ] **SSL**: Certificado SSL válido en el dominio admin
- [ ] **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options configurados
- [ ] **Environment Variables**: Credenciales y secrets en variables de entorno (NUNCA hardcodeadas)

---

## 8. Consideraciones Adicionales

### 8.1 Monitoreo y Alertas para el Admin
- **Monitoreo del Panel**: Alertar sobre:
  - Accesos desde ubicaciones inusuales
  - Múltiples intentos fallidos de login
  - Acciones sensibles (solicitudes de contexto, suspensiones en masa)
  - Cambios en configuraciones de seguridad

- **Canales de Alerta**:
  - Email al equipo de seguridad
  - Notificaciones push a dispositivos autorizados
  - Webhooks a sistemas de monitoreo (PagerDuty, Opsgenie)

### 8.2 Backup y Recuperación
- **Logs de Auditoría**:
  - Backup diario de logs de auditoría
  - Almacenamiento redundante (multi-región)
  - Retención mínima: 1 año (cumplimiento legal)
  - Encriptación en reposo y en tránsito

- **Configuraciones**:
  - Versionado de configuraciones globales
  - Capacidad de rollback a configuraciones anteriores
  - Backup automático antes de cada cambio

### 8.3 Actualizaciones y Mantenimiento
- **Versionado de API**:
  - Endpoints admin con versionado (`/api/admin/v1/*`)
  - Deprecación gradual de versiones antiguas
  - Documentación clara de cambios entre versiones

- **Proceso de Deploy**:
  - Staging environment para pruebas
  - Blue-green deploy para cero downtime
  - Rollback plan en caso de problemas

---

## Resumen Ejecutivo

El panel de super administración de **MenteAmiga-AI** está diseñado con tres pilares fundamentales:

1. **Funcionalidad Completa**: Control total de la plataforma sin afectar la experiencia del usuario final
2. **Seguridad Rigurosa**: Autenticación robusta, autorización granular, y auditoría completa
3. **Privacidad por Diseño**: Cumplimiento estricto con protección de datos de usuarios, acceso mínimo necesario, y transparencia en todas las acciones

La estructura técnica y funcional presentada en esta documentación asegura que el panel admin sea:
- **Mantenible**: Arquitectura modular y código bien organizado
- **Seguro**: Protegido contra amenazas comunes y acceso no autorizado
- **Escalable**: Preparado para crecimiento en número de usuarios y funcionalidades
- **Cumplidor**: Alineado con regulaciones de protección de datos (LOPD, GDPR)

Esta documentación sirve como guía completa para la implementación, mantenimiento y evolución del panel de super administración de MenteAmiga-AI.
