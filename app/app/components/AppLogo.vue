<template>
  <span class="group flex items-center gap-2.5">
    <span
      class="grid size-9 place-items-center rounded-full bg-default shadow-(--neu-sm) transition-shadow duration-300 group-hover:shadow-(--neu-in-sm)"
    >
      <img
        src="/logo.png"
        alt=""
        class="h-5 w-auto transition-transform duration-500 group-hover:rotate-[-12deg]"
        width="38"
        height="32"
      />
    </span>
    <!-- On phones the bar has room for the mark only; the name stays for screen readers. -->
    <span class="text-base font-medium tracking-[0.28em] text-highlighted max-sm:sr-only">
      S<span class="text-lucky">☉</span>LUCKY
    </span>
  </span>
</template>
