1. Clonar el Repositorio
bashgit clone https://github.com/yourusername/solution-tech-chat.git
cd solution-tech-chat
2. Instalar pnpm (si no lo tienes)
bashnpm install -g pnpm@8.15.1
3. Instalar Dependencias
bashpnpm install
4. Configurar Variables de Entorno
bashcp .env.example .env.local
Edita .env.local con tus configuraciones específicas.
5. Inicializar MSW (Mock Service Worker)
bashpnpm exec msw init public/ --save
6. Ejecutar en Modo Desarrollo
bashpnpm run dev
La aplicación estará disponible en http://localhost:3000
