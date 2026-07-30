import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // Включаем поддержку импорта с ?react
      include: '**/*.svg?react',
      
      // Настройки SVGR
      svgrOptions: {
        // Делает иконку адаптивной (размер = 1em)
        icon: true,
        
        // Включаем оптимизацию через SVGO
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // Сохраняем viewBox для правильного масштабирования
                  removeViewBox: false,
                },
              },
            },
            // Удаляем фиксированные размеры
            'removeDimensions',
          ],
        },
        
        // Поддержка title для доступности
        titleProp: true,
        
        // Поддержка ref
        ref: true,
        
        // Мемоизация компонента
        memo: true,
      },
    }),
  ],
});