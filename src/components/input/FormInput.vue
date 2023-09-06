<script setup lang="ts">
import { PropType, Ref } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  error: {
    type: String as PropType<string | Ref<string>>,
    required: false,
    default: undefined,
  },
})
</script>

<template>
  <div>
    <label>{{ label }}</label>
    <slot></slot>
    <slot name="error">
      <p v-if="error" class="text--red">{{ error }}</p>
    </slot>
  </div>
</template>
