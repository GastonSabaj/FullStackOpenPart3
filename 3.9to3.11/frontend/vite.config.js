import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
/* 
Después de reiniciar, el entorno de desarrollo de React funcionará como un proxy. 
Si el código de React realiza una solicitud HTTP a una dirección de servidor en http://localhost:5173 no administrada 
por la aplicación React en sí (es decir, cuando las solicitudes no tratan de obtener el CSS o JavaScript de la aplicación),
 la solicitud se redirigirá a el servidor en http://localhost:3001.
*/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})
