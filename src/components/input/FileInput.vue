<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['upload'])
const fileInput = ref()

const updateFile = (e: Event) => {
  const { files } = e.target as HTMLInputElement

  if (files && files.length) {
    fileInput.value = files.item(0)
    emit('upload', fileInput.value)
  }
}
if (fileInput.value) emit('upload', fileInput.value)
</script>

<template>
  <div>
    <label>Choose a file to upload:</label>
    <input
      type="file"
      ref="fileInput"
      @input="updateFile"
    />
  </div>
</template>
