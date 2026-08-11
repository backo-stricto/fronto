/*
* This component is used to display a boolean value in a cell in the table component.
* It takes a boolean value as a prop and displays it as "true" or "false".
* If the value is null, it displays "null" and applies a disabled style to the cell.
*/

<script lang="ts" setup>
const model = defineModel<boolean | null>()
</script>

<template>
    <div class="flex flex-col gap-2"
        :class="{ 'opacity-50 pointer-events-none': model === null, 'text-gray-400': model === null }">
        {{ model }}
    </div>
</template>

<style scoped>
/* Component-local styles */
</style>
