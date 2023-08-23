/// <reference types="vite/client" />


declare const __CESIUM_TOKEN__: string;
declare const __GOOGLE_TOKEN__: string;
declare const __MAPBOX_TOKEN__: string;
declare const __CLIENT_ID__: string;
declare const __DOMAIN__: string;
declare const __API_URL__: string;

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
