# Arquitectura del Sistema - Solution Tech Chat

## Visión General

Aplicación SPA (Single Page Application) con arquitectura de componentes basada en React/Next.js 15, siguiendo el patrón de separación de responsabilidades con capas bien definidas.

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| Next.js | Framework React |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos |
| ShadCN UI | Componentes UI |
| Zustand | Estado global |
| React Query | Gestión de datos |
| Framer Motion | Animaciones |
| MSW | Mock API |

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/JirigoyenP/solution-tech-chat.git
cd solution-tech-chat
```

### 2. Instalar pnpm (si no lo tienes)

```bash
npm install -g pnpm@8.15.1
```

### 3. Instalar Dependencias

```bash
pnpm install
```

### 4. Configurar Variables de Entorno
Crea un . env 

NEXT_PUBLIC_APP_NAME=Solution Tech Chat
NEXT_PUBLIC_COMPANY_NAME=SOLUTION TECH
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ENABLE_MSW=true

### 5. Inicializar MSW (Mock Service Worker)

```bash
pnpm exec msw init public/ --save
```

### 6. Ejecutar en Modo Desarrollo

```bash
pnpm run dev
```

La aplicación estará disponible en http://localhost:3000

## Arquitectura de Capas

### 1. Capa de Presentación

- **Componentes React**: Divididos en UI base, chat, historial y layout
- **Páginas Next.js**: App Router con layout compartido
- **Estilos**: Tailwind CSS con utility-first approach
- **Animaciones**: Framer Motion para transiciones

### 2. Capa de Lógica de Negocio

**Custom Hooks**: Encapsulan lógica reutilizable

- `useChat`: Gestión de conversaciones
- `useLocalStorage`: Persistencia de datos

### 3. Capa de Estado

**Zustand Stores**:
- `chatStore`: Estado global de chats (persistente)
- `uiStore`: Estado de interfaz (tema, sidebar)

**React Query**: Cache y sincronización de datos
**Context API**: Providers para theme y configuración

### 4. Capa de Servicios

- `chatService`: Comunicación con API
- `storageService`: Gestión de localStorage
- `MSW handlers`: Mock de endpoints API

## Flujo de Datos

```
Usuario → Componente → Hook → Store/Service → API (MSW) → Store → Componente → UI
```

## Estructura del Proyecto

```
solution-tech-chat/
├── app/
│   ├── layout.tsx           # Layout principal con providers
│   ├── page.tsx             # Página del chat
│   ├── providers.tsx        # Context providers
│   └── globals.css          # Estilos globales
│
├── components/
│   ├── ui/                  # Componentes base reutilizables
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── chat/                # Componentes del chat
│   │   ├── ChatInterface.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── FileUpload.tsx
│   ├── history/             # Componentes del historial
│   │   ├── ChatHistory.tsx
│   │   └── HistoryItem.tsx
│   └── layout/              # Componentes de layout
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── hooks/                   # Custom React hooks
│   ├── useChat.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
├── lib/
│   ├── utils.ts            # Funciones de utilidad
│   └── msw/                # Mock Service Worker
│       ├── handlers.ts
│       └── browser.ts
│
├── services/               # Servicios externos
│   └── chatService.ts
│
├── stores/                 # Estado global (Zustand)
│   ├── chatStore.ts
│   └── uiStore.ts
│
└── types/                  # Definiciones TypeScript
    └── index.ts
```

## Patrones de Diseño

### Composición de Componentes

```tsx
<ChatInterface>
  <MessageList>
    <MessageItem />
  </MessageList>
  <MessageInput>
    <FileUpload />
  </MessageInput>
</ChatInterface>
```


### Separación de Responsabilidades

| Capa | Responsabilidad |
|------|----------------|
| Componentes | Presentación y UI |
| Hooks | Lógica de negocio |
| Services | Comunicación externa |
| Stores | Estado global |
| Utils | Funciones puras |

## Gestión de Estado

### Zustand Store Structure

```typescript
interface ChatStore {
  chats: Chat[]
  currentChatId: string | null
  addMessage: (message: Message) => void
  deleteChat: (chatId: string) => void
  searchChats: (query: string) => Chat[]
}
```


## Persistencia de Datos

### LocalStorage Strategy

- Chats guardados automáticamente
- Límite de 5MB monitoreado
- Sincronización entre pestañas
- Fallback a memoria si falla

### Estructura de Datos

```typescript
{
  chats: Chat[]           // Array de conversaciones
  currentChatId: string   // Chat activo
  messages: Message[]     // Mensajes por chat
  metadata: {             // Información adicional
    version: string
    lastUpdated: Date
  }
}
```

## Optimizaciones Implementadas

### Performance

- Lazy loading de componentes pesados
- Memoización con React.memo
- useMemo para cálculos costosos
- useCallback para funciones estables
- Debounce en búsqueda (300ms)
- Throttle en eventos de scroll

### Bundle Size

- Dynamic imports para code splitting
- Tree shaking automático
- Minificación con SWC
- CSS purge en producción

## Seguridad

### Medidas Implementadas

- Input sanitization
- Validación de archivos (tipo y tamaño)
- XSS protection vía React
- Environment variables para configuración sensible
- Rate limiting preparado
- CORS configurado

### Validación de Archivos

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
```

## Endpoints API (MSW)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/chat | Enviar mensaje |
| GET | /api/chat/history | Obtener historial |
| DELETE | /api/chat/:id | Eliminar chat |
| GET | /api/health | Health check |
