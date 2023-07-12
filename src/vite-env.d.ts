/// <reference types="vite/client" />


declare const __CESIUM_TOKEN__: string;
declare const __GOOGLE_TOKEN__: string;
declare const SCSS: any;

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
