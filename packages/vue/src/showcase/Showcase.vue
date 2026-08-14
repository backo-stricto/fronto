<script setup lang="ts">
import {
    FRONTO_COMPONENTS_REGISTRY,
    resolveFrontoComponent,
} from "./registry";
</script>

<template>
    <main>
        <h1>Fronto component showcase</h1>

        <section v-for="(variants, type) in FRONTO_COMPONENTS_REGISTRY" :key="type">
            <h2>{{ type }}</h2>

            <div v-for="(_, variant) in variants" :key="variant">
                <h3>{{ variant }}</h3>

                <component :is="resolveFrontoComponent(type, variant)" />
            </div>
        </section>
    </main>
</template>
