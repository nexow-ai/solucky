<script setup lang="ts">
/**
 * The landing's right-hand index: Play and the page's section anchors, with a
 * marker that slides along the rail as you scroll. Labels sit to the left of
 * the rail in LTR (mirrored in RTL). Hidden below lg; the header keeps the
 * links on other routes.
 */
const { t } = useI18n();
const localePath = useLocalePath();

const sectionIds = ['how-it-works', 'fairness', 'faq'] as const;
const activeSection = useSectionSpy(sectionIds);

const items = computed(() => [
  { key: 'play' as const, label: t('nav.play'), to: localePath('/play'), icon: 'i-lucide-ticket' },
  { key: 'how-it-works' as const, label: t('nav.how'), hash: '#how-it-works', index: '02' },
  { key: 'fairness' as const, label: t('nav.fairness'), hash: '#fairness', index: '03' },
  { key: 'faq' as const, label: t('nav.faq'), hash: '#faq', index: '04' },
]);

const activeKey = computed(() => activeSection.value ?? 'play');

const activeIndex = computed(() => {
  const i = items.value.findIndex((item) => item.key === activeKey.value);
  return i >= 0 ? i : 0;
});

const nav = useTemplateRef<HTMLElement>('nav');
const itemEls = useTemplateRef<HTMLElement[]>('item');
const markerY = ref(0);
const visible = ref(false);

function syncMarker() {
  const root = nav.value;
  const el = itemEls.value?.[activeIndex.value];
  if (!root || !el) return;
  const rootBox = root.getBoundingClientRect();
  const itemBox = el.getBoundingClientRect();
  markerY.value = itemBox.top + itemBox.height / 2 - rootBox.top;
}

onMounted(() => {
  if (route.path !== localePath('/')) return;
  visible.value = true;
  nextTick(syncMarker);
  window.addEventListener('resize', syncMarker, { passive: true });
});

watch(activeIndex, () => nextTick(syncMarker));

onBeforeUnmount(() => window.removeEventListener('resize', syncMarker));
</script>

<template>
  <nav
    v-show="visible"
    ref="nav"
    :aria-label="t('legal.onThisPage')"
    class="section-index pointer-events-none fixed z-40 hidden lg:block"
  >
    <div class="rail" aria-hidden="true">
      <span class="meter" />
      <span class="marker" :style="{ top: `${markerY}px` }" />
    </div>
    <ol class="items">
      <li
        v-for="(item, index) in items"
        :key="item.key"
        ref="item"
        class="item"
        :style="{ '--i': index }"
      >
        <ULink
          v-if="'to' in item"
          :to="item.to"
          class="link group"
          :class="{ 'is-active': activeKey === item.key }"
          :aria-current="activeKey === item.key ? 'location' : undefined"
        >
          <UIcon :name="item.icon" class="icon size-3.5 shrink-0" />
          <span class="label kicker">{{ item.label }}</span>
        </ULink>
        <a
          v-else
          :href="item.hash"
          class="link group"
          :class="{ 'is-active': activeKey === item.key }"
          :aria-current="activeKey === item.key ? 'location' : undefined"
        >
          <span class="index font-mono text-[0.65rem] tracking-widest" dir="ltr">{{ item.index }}</span>
          <span class="label kicker">{{ item.label }}</span>
        </a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.section-index {
  inset-inline-end: clamp(0.75rem, 2vw, 1.75rem);
  top: calc(var(--ui-header-height) + 2.5rem);
  bottom: 2.5rem;
  width: 11rem;
}

.items {
  position: absolute;
  inset-inline-end: 0;
  inset-block: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.35rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.rail {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0.35rem;
  width: 2px;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--ui-border) 80%, transparent);
  overflow: hidden;
}

.meter {
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 100%;
  transform-origin: top center;
  background: linear-gradient(
    180deg,
    var(--ui-color-primary-500),
    var(--color-pink-600),
    var(--ui-secondary)
  );
  opacity: 0.35;
  pointer-events: none;
}

.marker {
  position: absolute;
  inset-inline: -3px;
  height: 1.35rem;
  margin-top: -0.675rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, var(--ui-primary), var(--ui-secondary));
  box-shadow: 0 0 14px color-mix(in oklab, var(--ui-primary) 75%, transparent);
  transition: top 0.65s var(--ease-out-expo);
}

.link {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
  padding-inline-end: 1.25rem;
  text-align: end;
  color: var(--ui-text-muted);
  transition:
    color 0.35s ease,
    translate 0.45s var(--ease-out-expo);
}

.link:dir(rtl) {
  text-align: start;
}

.link:hover {
  color: var(--ui-text-toned);
  translate: -2px 0;
}

.link:dir(rtl):hover {
  translate: 2px 0;
}

.link.is-active {
  color: var(--ui-primary);
}

.link.is-active .label {
  opacity: 1;
  letter-spacing: 0.16em;
}

.link.is-active .index,
.link.is-active .icon {
  filter: drop-shadow(0 0 8px color-mix(in oklab, var(--ui-primary) 65%, transparent));
}

.label {
  max-width: 7.5rem;
  font-size: 0.65rem;
  opacity: 0.72;
  transition:
    opacity 0.35s ease,
    letter-spacing 0.45s var(--ease-out-expo);
}

.index {
  color: var(--ui-secondary);
  opacity: 0.85;
}

.icon {
  color: var(--ui-secondary);
  opacity: 0.85;
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .meter {
      animation: index-meter linear both;
      animation-timeline: scroll(root block);
    }
  }

  .section-index {
    animation: index-in 0.9s var(--ease-out-expo) 0.35s both;
  }

  .item {
    animation: index-item 0.8s var(--ease-out-expo) both;
    animation-delay: calc(0.45s + var(--i) * 70ms);
  }
}

@keyframes index-meter {
  from {
    transform: scaleY(0);
  }
}

@keyframes index-in {
  from {
    opacity: 0;
    translate: 1rem 0;
  }
}

@keyframes index-item {
  from {
    opacity: 0;
    translate: 0.75rem 0;
  }
}

.section-index:dir(rtl) {
  animation-name: index-in-rtl;
}

@keyframes index-in-rtl {
  from {
    opacity: 0;
    translate: -1rem 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marker {
    transition: none;
  }
}
</style>
