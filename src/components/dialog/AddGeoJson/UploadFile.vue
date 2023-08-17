<template>
  <FileInput :value="file" @upload="onUpload" />
</template>

<script setup lang="ts">
import FileInput from '@component/input/FileInput.vue'
import { ref } from 'vue'

defineProps(['modelValue'])
const $emits = defineEmits(['update:modelValue'])
const file = ref()

const onUpload = (e: any) => {
  file.value = e
  $emits('update:modelValue', file.value)
}
</script>
