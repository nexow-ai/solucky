<script setup lang="ts">
/**
 * The network selector in the header: test SOL or real SOL. Each cluster is
 * its own deployment of the app, so the other side links to the same page
 * there (`NUXT_PUBLIC_MAINNET_URL`, `NUXT_PUBLIC_TESTNET_URL`) and stays
 * disabled while that deployment has no URL.
 */
defineProps<{ block?: boolean }>();

const config = useRuntimeConfig().public;
const route = useRoute();
const { t } = useI18n();
const { clusterLabel, isMainnet } = useSolana();

const options = computed(() => {
  const test = {
    key: 'test',
    label: t('network.test'),
    current: !isMainnet,
    href: isMainnet ? networkHref(config.testnetUrl, route.fullPath) : null,
  };
  const main = {
    key: 'main',
    label: t('network.main'),
    current: isMainnet,
    href: isMainnet ? null : networkHref(config.mainnetUrl, route.fullPath),
  };
  const tip = (option: typeof test, here: string, away: string) =>
    option.current ? here : option.href ? away : t('network.notYet', { network: option.label });
  return [
    { ...test, tip: tip(test, t('network.testHere', { cluster: clusterLabel }), t('network.goTest')) },
    { ...main, tip: tip(main, t('network.mainHere'), t('network.goMain')) },
  ];
});
</script>

<template>
  <nav
    :aria-label="t('network.label')"
    class="shrink-0 grid-cols-[repeat(2,minmax(max-content,1fr))] gap-1 rounded-full p-1 font-mono shadow-(--neu-in-sm) text-[0.65rem] font-semibold tracking-[0.12em] uppercase"
    :class="block ? 'grid w-full' : 'inline-grid'"
  >
    <UTooltip v-for="option in options" :key="option.key" :text="option.tip" :content="{ sideOffset: 10 }">
      <a v-if="option.href" :href="option.href" class="segment" :data-network="option.key">
        {{ option.label }}
      </a>
      <span
        v-else
        class="segment"
        :data-network="option.key"
        :aria-current="option.current ? 'true' : undefined"
        :aria-disabled="option.current ? undefined : 'true'"
        tabindex="0"
      >
        <span v-if="option.current" class="dot" aria-hidden="true" />
        {{ option.label }}
        <UIcon v-if="!option.current" name="i-lucide-lock" class="size-3 opacity-70" />
      </span>
    </UTooltip>
  </nav>
</template>

<style scoped>
.segment {
  --tint: var(--ui-warning);
  display: inline-flex;
  min-height: 1.6rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 9999px;
  padding-inline: 0.7rem;
  color: var(--ui-text-muted);
  white-space: nowrap;
  outline: none;
  transition:
    color 0.2s,
    box-shadow 0.2s;
}

.segment[data-network='main'] {
  --tint: var(--ui-success);
}

/* The mono face has no Arabic, Hebrew, Devanagari or Thai: its fallback draws them unjoined. */
.segment:is(:lang(ar), :lang(he), :lang(hi), :lang(th)) {
  font-family: var(--font-sans);
  font-size: 0.75rem;
}

.segment:focus-visible {
  box-shadow: 0 0 0 2px var(--ui-primary);
}

a.segment:hover {
  color: var(--ui-text-highlighted);
}

.segment[aria-disabled='true'] {
  color: var(--ui-text-dimmed);
  cursor: not-allowed;
}

/* The network in use stands out of the track. */
.segment[aria-current] {
  color: var(--tint);
  background: var(--ui-bg);
  box-shadow: var(--neu-xs);
}

.segment[aria-current]:focus-visible {
  box-shadow:
    var(--neu-xs),
    0 0 0 2px var(--ui-primary);
}

.dot {
  width: 0.375rem;
  height: 0.375rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

@media (prefers-reduced-motion: no-preference) {
  .dot {
    animation: var(--animate-breathe);
  }
}
</style>
