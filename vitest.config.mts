import { defineConfig } from 'vitest/config';

interface ConfiguracionPruebas {
  test?: {
    include?: string[];
  };
}

export default defineConfig({
  plugins: [
    {
      name: 'rutas-windows-con-parentesis-literales',
      enforce: 'post',
      configResolved(configuracion) {
        if (process.platform !== 'win32') {
          return;
        }

        const pruebas = (configuracion as unknown as ConfiguracionPruebas).test;
        if (!pruebas?.include) {
          return;
        }

        pruebas.include = pruebas.include.map((ruta) =>
          ruta.replace(/[()]/g, '\\$&')
        );
      },
    },
  ],
});
