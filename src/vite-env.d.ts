/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LUNA_VALIDATION_EMAIL?: string;
  readonly VITE_LUNA_VALIDATION_PASSWORD?: string;
  readonly VITE_LUNA_VALIDATION_ACCESS_TOKEN?: string;
  readonly VITE_LUNA_CONTRACT_PROBES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
