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
    class="glass-pill grid-cols-2 gap-0.5 rounded-full p-0.5 font-mono text-[0.65rem] font-semibold tracking-[0.14em] uppercase"
    :class="block ? 'grid w-full' : 'inline-grid'"
  >
    <UTooltip v-for="option in options" :key="option.key" :text="option.tip" :content="{ sideOffset: 10 }">
      <a v-if="option.href" :href="option.href" class="segment" :data-network="option.key">
        <span class="dot" aria-hidden="true" />
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
        <span class="dot" aria-hidden="true" />
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
  min-height: 1.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 9999px;
  padding-inline: 0.8rem;
  color: var(--ui-text-muted);
  white-space: nowrap;
  outline: none;
  transition:
    color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}

.segment[data-network='main'] {
  --tint: var(--ui-success);
}

.segment:focus-visible {
  box-shadow: 0 0 0 2px var(--ui-primary);
}

a.segment:hover {
  color: var(--ui-text-highlighted);
  background: color-mix(in oklab, var(--tint) 12%, transparent);
}

.segment[aria-disabled='true'] {
  color: var(--ui-text-dimmed);
  cursor: not-allowed;
}

/* The network in use: a lit, tinted pane of glass inside the pill. */
.segment[aria-current] {
  color: var(--tint);
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--tint) 24%, transparent),
    color-mix(in oklab, var(--tint) 8%, transparent)
  );
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 28%, transparent),
    inset 0 0 0 1px color-mix(in oklab, var(--tint) 45%, transparent),
    0 0 18px -6px color-mix(in oklab, var(--tint) 75%, transparent);
}

.segment[aria-current]:focus-visible {
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--tint) 45%, transparent),
    0 0 0 2px var(--ui-primary);
}

.dot {
  width: 0.375rem;
  height: 0.375rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.4;
}

.segment[aria-current] .dot {
  opacity: 1;
  box-shadow: 0 0 8px currentColor;
}

@media (prefers-reduced-motion: no-preference) {
  .segment[aria-current] .dot {
    animation: var(--animate-twinkle);
  }
}
</style>
