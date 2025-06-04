<template>
  <div class="icon-svg" :style="svgStyle">
    <svg 
      :width="size" 
      :height="size" 
      :viewBox="viewBox"
      :style="{ fill: color }"
      class="svg-icon"
    >
      <component :is="icon" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  icon: {
    type: Object,
    required: true
  },
  size: {
    type: [Number, String],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  viewBox: {
    type: String,
    default: '0 0 24 24'
  }
});

const svgStyle = computed(() => {
  return {
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  };
});
</script>

<style scoped>
.icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.svg-icon {
  vertical-align: middle;
}
</style> 