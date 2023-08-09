<template>
  <form @submit.prevent="submitForm">
    <FileInput v-model="file" />
    <button type="submit">Send</button>
  </form>
</template>

<script setup lang="ts">
import FileInput from '@/input/FileInput.vue'
import axios from 'axios'
import { ref } from 'vue'

const file = ref()
const uploadFile = (url: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const submitForm = async () => {
  if (file.value) {
    const { data } = await uploadFile('http://localhost:8080/v1/geojson/upload', file.value)
    console.log({ data });
  }
}
</script>
