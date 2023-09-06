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
  <div class="col">
    <input
      type="file"
      ref="fileInput"
      class="custom-file-input mt-2 mb-2 flex"
      @input="updateFile"
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-file-input::-webkit-file-upload-button {
  visibility: visible;
  background-color: #fff;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  color: var(--el-button-text-color);
  font-weight: 600;
  letter-spacing: 0.25px;
  font-family: Poppins, sans-serif;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    border-color: #7ad5ff;
    color: #7ad5ff;
    background-color: #7ad5ff22;
    transition: border-color 0.15s ease-in, color 0.15s ease-in;
  }
}
</style>
