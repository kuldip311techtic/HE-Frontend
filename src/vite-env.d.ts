/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LUNA_VALIDATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
