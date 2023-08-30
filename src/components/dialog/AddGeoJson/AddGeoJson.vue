<template>
  <el-form ref="formEl" @submit.prevent>
    <form-input
      label="Name of your layer:"
      :error="v?.alias?.$errors[0]?.$message || ''"
    >
      <el-input type="text" v-model="v.alias.$model" class="mt-2"> </el-input>
    </form-input>
    <el-tabs v-model="currentUploadOption" type="card" class="mt-4">
      <el-tab-pane label="FILE" name="file">
        <form-input
          label="Choose a file to upload"
          :error="v?.file?.$errors[0]?.$message || ''"
        >
          <UploadFile v-model="v.file.$model" />
        </form-input>
      </el-tab-pane>
      <el-tab-pane label="JSON" name="text">
        <form-input
          label="Enter your GEOJSON data:"
          :error="v?.text?.$errors[0]?.$message || ''"
        >
          <el-input type="textarea" :rows="6" v-model="v.text.$model" />
        </form-input>
      </el-tab-pane>
    </el-tabs>
    <el-button class="mt-2 pl-12" @click="submitForm">Send</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useGeoJSONLoader from '@/composables/geojson/GeoJSONLoader'
import axios from 'axios'
import UploadFile from './UploadFile.vue'
import { useVuelidate } from '@vuelidate/core'
import FormInput from '@/components/input/FormInput.vue'
import { required, requiredIf } from '@vuelidate/validators'
import type { FormInstance } from 'element-plus'

const formEl = ref<FormInstance>()
const currentUploadOption = ref<'file' | 'text'>('file')

const { load, toggleSourceVisibility } = useGeoJSONLoader()
const emits = defineEmits(['close'])

const alias = ref('')
const text = ref('')
const file = ref<'' | File>('')

const rules = computed(() => ({
  alias: { required },
  text: { isTextInput: requiredIf(() => currentUploadOption.value === 'text') },
  file: { isFileInput: requiredIf(() => currentUploadOption.value === 'file') },
}))

const v = useVuelidate(rules, { alias, text, file })

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
    console.log({ f })
    fr.onload = (e: ProgressEvent<EventTarget & { result: any }>) => {
      resolve(e?.target?.result)
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
  return file.value ? JSON.parse(await readFileContentAsync(file.value)) : ''
})

const submitForm = async () => {
  if (!(await v.value.$validate())) return

  await load({
    alias: alias.value,
    url: await json.value,
    options: { clampToGround: true },
  })
  toggleSourceVisibility(alias.value)
  emits('close')
}
</script>
