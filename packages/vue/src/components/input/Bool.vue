<script setup lang="ts">
const model = defineModel<boolean | null>()
</script>

<template>
    <v-switch v-model="model" true-icon="mdi-check" false-icon="mdi-close" inset="material"
        color="model ? 'success' : 'secondary'" label="model ? 'Yes' : 'No'" />
</template>

<style scoped>
/* Component-local styles */
</style>
