/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LUNA_VALIDATION_EMAIL?: string;
  readonly VITE_LUNA_VALIDATION_PASSWORD?: string;
  readonly VITE_LUNA_VALIDATION_SESSION_ID?: string;
  readonly VITE_LUNA_CONTRACT_PROBE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
