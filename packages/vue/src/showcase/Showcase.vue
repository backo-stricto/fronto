<script setup lang="ts">
import {
    FRONTO_COMPONENTS_REGISTRY,
    resolveFrontoComponent,
} from "./registry";

const VARIANTS = Array.from(
    new Set(
        Object.values(FRONTO_COMPONENTS_REGISTRY as Record<string, Record<string, unknown>>)
            .flatMap((variants) => Object.keys(variants)),
    ),
);

const VARIANT_COLUMNS_COUNT = Math.max(VARIANTS.length, 1);

const gridTemplateColumns = `minmax(140px, 180px) repeat(${VARIANT_COLUMNS_COUNT}, minmax(220px, 1fr))`;
</script>

<template>
    <main class="mx-auto max-w-[1100px] p-8">
        <h1 class="mb-6 text-3xl font-bold tracking-tight">
            Fronto components showcase
        </h1>

        <section class="mx-auto grid w-fit items-stretch gap-0 max-[740px]:grid-cols-1"
            :style="{ gridTemplateColumns }">
            <div class="border-b border-base-300 px-4 py-3 font-bold capitalize max-[740px]:hidden">
                Type
            </div>

            <div v-for="variant in VARIANTS" :key="`header-${variant}`"
                class="border-b border-base-300 px-4 py-3 font-bold capitalize max-[740px]:hidden">
                {{ variant }}
            </div>

            <template v-for="(variants, type) in FRONTO_COMPONENTS_REGISTRY" :key="type">
                <div
                    class="border-b border-base-200 px-4 py-3 font-semibold max-[740px]:bg-base-200 max-[740px]:pb-1.5 max-[740px]:pt-5 max-[740px]:border-b-0">
                    {{ type }}
                </div>

                <div v-for="variant in VARIANTS" :key="`${type}-${variant}`" class="border-b border-base-200 px-4 py-3">
                    <component v-if="variant in variants" :is="resolveFrontoComponent(type, variant)" />
                </div>
            </template>
        </section>
    </main>
</template>
