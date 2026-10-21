/** Chromium's `beforeinstallprompt` event; not in TypeScript's DOM types yet. */
export interface InstallPrompt extends Event {
  prompt(): Promise<unknown>;
}

/** The install offer the browser made, kept until it is used or the app is installed (plugins/pwa.client.ts). */
export const useInstallPrompt = () => useState<InstallPrompt | null>('install-prompt', () => null);
