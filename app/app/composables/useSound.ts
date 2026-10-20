const SOUNDS = {
  click: '/sounds/click.mp3',
  commit: '/sounds/commit.wav',
  committed: '/sounds/committed.wav',
  wrong: '/sounds/wrong.mp3',
  pot: '/sounds/pot.mp3',
} as const;

export type SoundName = keyof typeof SOUNDS;

const STORAGE_KEY = 'solucky:sound';
const enabled = ref(true);
const players = new Map<SoundName, HTMLAudioElement>();
let loaded = false;

/** The game's sound effects, with an on/off switch remembered per browser. */
export function useSound() {
  if (import.meta.client && !loaded) {
    loaded = true;
    try {
      enabled.value = localStorage.getItem(STORAGE_KEY) !== 'off';
    } catch {
      // Storage can be blocked; sound stays on.
    }
  }

  function toggle() {
    enabled.value = !enabled.value;
    try {
      localStorage.setItem(STORAGE_KEY, enabled.value ? 'on' : 'off');
    } catch {
      // Not remembered, but still applied for this visit.
    }
  }

  function play(name: SoundName) {
    if (!import.meta.client || !enabled.value) return;
    let audio = players.get(name);
    if (!audio) {
      audio = new Audio(SOUNDS[name]);
      players.set(name, audio);
    }
    audio.currentTime = 0;
    // Browsers block audio before the first interaction; that is fine.
    audio.play().catch(() => {});
  }

  return { enabled: readonly(enabled), toggle, play };
}
