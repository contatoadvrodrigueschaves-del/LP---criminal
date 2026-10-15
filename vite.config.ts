import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      // A política de privacidade é uma segunda página estática: entra como
      // entrada própria para compartilhar o CSS e o cache de fontes do site.
      // Caminhos relativos à raiz — `__dirname` não existe em config ESM.
      input: {
        main: 'index.html',
        privacidade: 'privacidade.html',
      },
    },
  },
});
