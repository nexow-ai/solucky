<script setup lang="ts">
import { LOCALES } from '~~/i18n/languages';

const config = useRuntimeConfig().public;
const { explorer, programAddress, clusterLabel } = useSolana();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const sound = useSound();
const switchLocalePath = useSwitchLocalePath();

const links = computed(() =>
  [
    { icon: 'i-simple-icons-x', label: 'X', to: config.twitterUrl },
    { icon: 'i-simple-icons-discord', label: 'Discord', to: config.discordUrl },
    { icon: 'i-simple-icons-github', label: t('footer.source'), to: config.githubUrl },
  ].filter((link) => link.to),
);
</script>

<template>
  <UFooter class="relative mt-16" :ui="{ top: 'p-0', right: 'flex-wrap gap-y-3' }">
    <!-- The neon city from the original landing hero, at the foot of every page. -->
    <template #top>
      <CitySkyline />
    </template>

    <template #left>
      <div class="space-y-1 text-sm text-muted">
        <p>
          © <span dir="ltr">2022–{{ new Date().getFullYear() }}</span>
          <ULink
            to="https://nexow.studio"
            target="_blank"
            class="text-default underline decoration-primary/40 underline-offset-4 hover:text-primary"
          >
            Nexow, Inc.
          </ULink>
          · {{ t('footer.license') }}
        </p>
        <p>
          <i18n-t keypath="footer.program" scope="global">
            <template #address>
              <ULink
                :to="explorer('address', programAddress)"
                target="_blank"
                dir="ltr"
                class="font-mono text-xs hover:text-primary"
              >
                {{ shortAddress(programAddress, 6) }}
              </ULink>
            </template>
            <template #cluster>{{ clusterLabel }}</template>
          </i18n-t>
          {{ t('footer.age') }}
        </p>
        <nav :aria-label="t('footer.legal')" class="flex flex-wrap gap-x-4 gap-y-1 pt-2">
          <ULink
            v-for="page in LEGAL_PAGES"
            :key="page.to"
            :to="localePath(page.to)"
            exact
            class="underline-offset-4 hover:text-primary hover:underline"
          >
            {{ t(`legal.pages.${page.key}.label`) }}
          </ULink>
        </nav>
        <nav :aria-label="t('footer.languages')" class="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs text-dimmed">
          <ULink
            v-for="l in LOCALES"
            :key="l.code"
            :to="switchLocalePath(l.code)"
            :hreflang="l.language"
            :lang="l.language"
            :aria-current="l.code === locale ? 'true' : undefined"
            class="hover:text-primary aria-[current]:text-toned"
            @click="rememberLanguage(l.code)"
          >
            {{ l.name }}
          </ULink>
        </nav>
      </div>
    </template>

    <template #right>
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
        <ULink to="https://solana.com" target="_blank" class="group text-muted hover:text-highlighted">
          <i18n-t keypath="footer.builtOn" tag="span" scope="global">
            <template #solana>
              <span
                dir="ltr"
                class="inline-flex items-center gap-1.5 align-middle font-semibold text-toned group-hover:text-highlighted"
              >
                <UIcon name="i-simple-icons-solana" class="size-4" />
                Solana
              </span>
            </template>
          </i18n-t>
        </ULink>
        <ULink
          to="https://nexow.studio"
          target="_blank"
          :aria-label="t('footer.madeBy', { nexow: 'Nexow' })"
          class="group text-muted hover:text-highlighted"
        >
          <i18n-t keypath="footer.madeBy" tag="span" scope="global">
            <template #nexow>
              <!-- The Nexow wordmark as a mask, so it takes the link's color in both themes. -->
              <span
                dir="ltr"
                aria-hidden="true"
                class="-my-2 inline-block h-8 w-[3.27rem] bg-(--ui-text-toned) align-middle [mask:url(/brands/nexow.png)_center/contain_no-repeat] group-hover:bg-(--ui-text-highlighted)"
              />
            </template>
          </i18n-t>
        </ULink>
        <span aria-hidden="true" class="hidden h-5 w-px bg-(--ui-border) sm:block" />
      </div>
      <UButton
        v-for="link in links"
        :key="link.label"
        :icon="link.icon"
        :to="link.to"
        :aria-label="link.label"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
      <!-- The page's settings: sound effects and the light or dark theme. -->
      <div class="flex items-center gap-1 rounded-full p-1 shadow-(--neu-in-sm)">
        <!-- The sound setting is remembered in the browser, so it renders there. -->
        <ClientOnly>
          <UTooltip :text="sound.enabled.value ? t('footer.mute') : t('footer.unmute')">
            <UButton
              :icon="sound.enabled.value ? 'i-lucide-volume-2' : 'i-lucide-volume-x'"
              :aria-label="sound.enabled.value ? t('footer.mute') : t('footer.unmute')"
              color="neutral"
              variant="ghost"
              size="sm"
              class="rounded-full"
              @click="sound.toggle()"
            />
          </UTooltip>
          <template #fallback>
            <span class="block size-7" />
          </template>
        </ClientOnly>
        <UColorModeButton size="sm" class="rounded-full" />
      </div>
    </template>
  </UFooter>
</template>
