/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WIDGET_URL: string;
}

interface ImportEnv {
  readonly env: ImportMetaEnv;
}
