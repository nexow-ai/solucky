<script setup lang="ts">
import { type Locale, localeInfo, matchLocale } from '~~/i18n/languages';
import { SUGGEST } from '~~/i18n/suggest';

/**
 * A visitor whose browser prefers another of the site's languages is offered
 * this page in it, in that language, once. Nothing redirects: the choice, or
 * "no thanks", is kept in this browser (utils/lang.ts) and the offer does not
 * come back.
 */
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const offer = ref<Locale | null>(null);

const words = computed(() => (offer.value ? SUGGEST[offer.value] : null));
const info = computed(() => (offer.value ? localeInfo(offer.value) : null));

let timer: ReturnType<typeof setTimeout> | undefined;
onMounted(() => {
  const wanted = savedLanguage() ?? (navigator.languages ?? [navigator.language]).map(matchLocale).find(Boolean);
  if (wanted && wanted !== locale.value) timer = setTimeout(() => (offer.value = wanted), 1_200);
});
onBeforeUnmount(() => clearTimeout(timer));
// Gone once the page is in that language, however the visitor got there.
watch(locale, (code) => {
  if (code === offer.value) offer.value = null;
});

function decide(code: string) {
  rememberLanguage(code);
  offer.value = null;
}
</script>

<template>
  <Transition
    enter-from-class="translate-y-4 opacity-0"
    enter-active-class="transition duration-700 ease-out"
    leave-to-class="opacity-0"
    leave-active-class="transition duration-200"
  >
    <!-- Placed by the page's direction (away from the toasts), written in the offered language's. -->
    <div v-if="offer && words && info" class="fixed start-4 bottom-4 z-50 w-[min(22rem,calc(100vw-2rem))]">
      <aside
        :lang="info.language"
        :dir="info.dir ?? 'ltr'"
        class="space-y-3 rounded-(--ui-radius) bg-default/90 p-4 shadow-xl ring ring-default backdrop-blur-md"
      >
        <p class="text-sm text-highlighted">{{ words.text }}</p>
        <div class="flex flex-wrap gap-2">
          <UButton
            :to="switchLocalePath(offer)"
            :hreflang="info.language"
            :label="words.go"
            size="sm"
            @click="decide(offer)"
          />
          <UButton :label="words.close" color="neutral" variant="ghost" size="sm" @click="decide(locale)" />
        </div>
      </aside>
    </div>
  </Transition>
</template>
