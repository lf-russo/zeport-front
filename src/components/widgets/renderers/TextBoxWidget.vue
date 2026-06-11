<template>
  <div
    class="text-box"
    :style="{
      fontSize: config.font_size || '14px',
      textAlign: config.align || 'left',
      fontWeight: config.bold ? '600' : '400'
    }"
  >
    {{ config.content || 'Texto...' }}
  </div>
</template>

<script setup>
defineProps({ config: Object, preview: Boolean })
</script>

<style scoped>
.text-box {
  width: 100%;
  color: var(--color-text);
  word-break: break-word;
}
</style>
