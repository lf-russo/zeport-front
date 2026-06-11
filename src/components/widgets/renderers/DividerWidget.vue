<template>
  <hr class="divider" />
</template>

<script setup>
defineProps({ config: Object, preview: Boolean })
</script>

<style scoped>
.divider {
  width: 100%;
  border: none;
  border-top: 0.5px solid var(--color-border);
}
</style>
