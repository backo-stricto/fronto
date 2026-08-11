<script setup lang="ts">
const model = defineModel<boolean | null>()
</script>

<template>
    <div class="flex flex-col gap-2" :class="{
        'opacity-50 pointer-events-none': model === null,
    }">
        {{ model }}
    </div>

</template>

<style scoped>
/* Component-local styles */
</style>
