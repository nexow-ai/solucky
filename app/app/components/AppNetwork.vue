<script setup lang="ts">
/**
 * The choice of network in the settings: test SOL or real SOL. Each cluster
 * is its own deployment of the app, so the other side links to the same page
 * there (`NUXT_PUBLIC_MAINNET_URL`, `NUXT_PUBLIC_TESTNET_URL`) and shows as
 * coming soon while that deployment has no URL.
 */
const config = useRuntimeConfig().public;
const route = useRoute();
const { t } = useI18n();
const { clusterLabel, isMainnet } = useSolana();

const options = computed(() => [
  {
    key: 'test',
    label: t('network.test'),
    tint: 'text-warning',
    current: !isMainnet,
    href: isMainnet ? networkHref(config.testnetUrl, route.fullPath) : null,
    hint: isMainnet ? t('network.goTest') : t('network.testHere', { cluster: clusterLabel }),
  },
  {
    key: 'main',
    label: t('network.main'),
    tint: 'text-success',
    current: isMainnet,
    href: isMainnet ? null : networkHref(config.mainnetUrl, route.fullPath),
    hint: isMainnet ? t('network.mainHere') : t('network.goMain'),
  },
]);
</script>

<template>
  <ul class="grid gap-0.5">
    <li v-for="option in options" :key="option.key">
      <component
        :is="option.href ? 'a' : 'div'"
        :href="option.href ?? undefined"
        class="option rounded-md"
        :aria-current="option.current ? 'true' : undefined"
        :aria-disabled="option.current || option.href ? undefined : 'true'"
      >
        <span
          class="led-dot mt-1.5"
          :class="[
            option.href || option.current ? option.tint : 'text-dimmed',
            option.current && 'motion-safe:animate-breathe',
          ]"
          aria-hidden="true"
        />
        <span class="min-w-0 flex-1">
          <span class="label block" :class="option.current && option.tint">{{ option.label }}</span>
          <span class="block text-xs text-muted">{{ option.hint }}</span>
        </span>
        <UIcon v-if="option.current" name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary" />
        <UBadge
          v-else-if="!option.href"
          :label="t('network.soon')"
          color="neutral"
          variant="soft"
          size="sm"
          class="shrink-0 bg-transparent font-mono text-[0.6rem] tracking-[0.12em] uppercase shadow-(--neu-in-sm)"
        />
      </component>
    </li>
  </ul>
</template>

<style scoped>
.label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* The mono face has no Arabic, Hebrew, Devanagari or Thai: its fallback draws them unjoined. */
.label:is(:lang(ar), :lang(he), :lang(hi), :lang(th)) {
  font-family: var(--font-sans);
  font-size: 0.75rem;
}

.option {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.5rem 0.625rem;
  color: var(--ui-text-toned);
  transition:
    color 0.2s,
    background-color 0.2s;
}

a.option:hover {
  background: var(--ui-bg-elevated);
  color: var(--ui-text-highlighted);
}

.option[aria-disabled='true'] {
  color: var(--ui-text-dimmed);
  cursor: not-allowed;
}

/* A network you cannot pick yet is not live: no halo. */
.option[aria-disabled='true'] .led-dot {
  box-shadow: none;
}
</style>
