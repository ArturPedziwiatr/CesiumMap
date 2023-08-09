<script setup lang="ts">
import { ref } from 'vue'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const fileInput = ref()

const updateFile = (e: Event) => {
  const { files } = e.target as HTMLInputElement

  if (files && files.length) {
    emit('update:modelValue', files.item(0))
  }
}
</script>

<template>
  <div>
    <label>Choose a file to upload:</label>
    <input type="file" ref="fileInput" @change="updateFile" />
  </div>
</template>
