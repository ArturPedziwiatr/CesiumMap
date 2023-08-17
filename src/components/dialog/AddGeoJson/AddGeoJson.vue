<template>
  <form @submit.prevent>
    <el-label>
      Name of your layer:
      <el-input type="text" v-model="name" class="mt-2" required></el-input>
    </el-label>
    <el-tabs v-model="currentUploadOption" type="card" class="mt-4">
      <el-tab-pane label="FILE" name="file">
        <UploadFile v-model="file" />
      </el-tab-pane>
      <el-tab-pane label="JSON" name="text">
        <UploadText v-model="text" />
      </el-tab-pane>
    </el-tabs>
    <div v-if="error">
      <p class="text--red">
        {{ error }}
      </p>
    </div>
    <el-button type="submit" class="mt-2 pl-12" @click="submitForm"
      >Send</el-button
    >
  </form>
</template>

<script setup lang="ts">
import useGeoJSONLoader from '@/composables/geojson/GeoJSONLoader'
import axios from 'axios'
import { computed, inject, ref } from 'vue'
import UploadFile from './UploadFile.vue'
import UploadText from './UploadText.vue'
import { MapsType } from '@/enums/MapType'
import { GeoJsonDataSource, Viewer } from 'cesium'

const name = ref()
const file = ref()
const text = ref('')
const error = ref()
const currentUploadOption = ref<'file' | 'text'>('file')

const { load, toggleSourceVisibility } = useGeoJSONLoader()

const emits = defineEmits(['close'])

const uploadFile = (url: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const readFileContentAsync = (f: File): Promise<string> =>
  new Promise(resolve => {
    const fr = new FileReader()
    fr.onload = e => {
      resolve(e.target.result)
    }
    fr.readAsText(f, 'utf-8')
  })

// const createJsonFile = (data: string) => {
//   const blob = new Blob([data], { type: 'application/json' })
//   return new File([blob], 'data.json', { type: 'application/json' })
// }

const json = computed(async () => {
  if (currentUploadOption.value === 'text') {
    return JSON.parse(text.value)
  }
  return JSON.parse(await readFileContentAsync(file.value))
})

const showError = (e: Error) => {
  error.value = e.message
}

const submitForm = async () => {
  // load(json.value, { clampToGround: true })
  // await viewer.dataSources.add(
  //   GeoJsonDataSource.load(json.value, { clampToGround: true })
  // )

  try {
    await load({
      alias: name.value,
      url: await json.value,
      options: { clampToGround: true },
    })
    toggleSourceVisibility(name.value)
    emits('close')
  } catch (e) {
    if (e instanceof Error)
      showError(e)
  }

  // if (currentUploadOption.value === 'file')
  //   return () => uploadFile('http://localhost:8080/v1/geojson/file', file.value)
  // else
  //   return () =>
  //     uploadFile(
  //       'http://localhost:8080/v1/geojson/file',
  //       createJsonFile(text.value)
  //     )
}
</script>
