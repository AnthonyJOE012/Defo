/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const content: string
  export default content
}

declare module 'react-dom/client' {
  import { ReactElement } from 'react'
  export interface RootOptions {
    identifierPrefix?: string
    namespaceURI?: string
    onRecoverableError?: (error: Error) => void
  }
  export function createRoot(container: Element | null, options?: RootOptions): { render(element: ReactElement): void, unmount(): void }
}
