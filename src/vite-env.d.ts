/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ITEMS_PER_PAGE: string;
  readonly VITE_DEBOUNCE_DELAY: string;
  readonly VITE_ENABLE_DARK_MODE: string;
  readonly VITE_ENABLE_EXPORT_FEATURES: string;
  readonly VITE_ENABLE_ADVANCED_FILTERS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}