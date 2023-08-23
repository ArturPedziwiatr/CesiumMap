<template>
  <el-form ref="formEl" @submit.prevent :model="ruleForm" :rules="rules">
    <label> Name of your layer: </label>
    <el-input
      type="text"
      v-model="ruleForm.alias"
      class="mt-2"
      :rules="[
        {
          required: true,
          message: 'alias is required',
        },
      ]"
    ></el-input>
    <el-tabs v-model="currentUploadOption" type="card" class="mt-4">
      <el-tab-pane label="FILE" name="file">
        <UploadFile v-model="ruleForm.file" />
      </el-tab-pane>
      <el-tab-pane label="JSON" name="text">
        <el-input
          type="textarea"
          :rows="6"
          v-model="ruleForm.text"
          :rules="[
            {
              required: true,
              message: 'This field is required.',
            },
          ]"
        />
      </el-tab-pane>
    </el-tabs>
    <div v-if="error">
      <p class="text--red">
        {{ error }}
      </p>
    </div>
    <el-button class="mt-2 pl-12" @click="submitForm(formEl)">Send</el-button>
  </el-form>
</template>

<script setup lang="ts">
import useGeoJSONLoader from '@/composables/geojson/GeoJSONLoader'
import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import UploadFile from './UploadFile.vue'
import type { FormInstance } from 'element-plus'

const formEl = ref<FormInstance>()
const error = ref()
const currentUploadOption = ref<'file' | 'text'>('file')

const { load, toggleSourceVisibility } = useGeoJSONLoader()
const emits = defineEmits(['close'])

const ruleForm = reactive<{ alias: string; text: string; file?: File }>({
  alias: '',
  text: '',
  file: undefined,
})

const validateFile = (rule: any, value: any, callback: any) => {
  if (!ruleForm.file) {
    return false
    // showError('You need to specify a file')
  }
}

const rules = reactive({
  file: [{ validator: validateFile, trigger: 'change' }],
})

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
    return JSON.parse(ruleForm.text)
  }
  return ruleForm.file
    ? JSON.parse(await readFileContentAsync(ruleForm.file))
    : ''
})

const showError = (msg: string) => {
  error.value = msg
}

const submitForm = async () => {
  // if (!form) return
  // form.validate(async isValid => {
  //   console.log({ isValid })
  //   if (isValid) {
  //   } else {
  //     showError('dupa')
  //     return false
  //   }
  // })
  await load({
    alias: ruleForm.alias,
    url: await json.value,
    options: { clampToGround: true },
  })
  toggleSourceVisibility(ruleForm.alias)
  emits('close')
  // formEl.value.validate(async valid => {
  //   if (valid) {
  //     try {
  //     } catch (e) {
  //       if (e instanceof Error) showError(e.message)
  //     }
  //   } else {
  //     console.log('error submit!')
  //     return false
  //   }
  // })
  // load(json.value, { clampToGround: true })
  // await viewer.dataSources.add(
  //   GeoJsonDataSource.load(json.value, { clampToGround: true })
  // )

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
