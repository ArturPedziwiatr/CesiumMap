<template>
  <el-input
    type="textarea"
    v-model="val"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref()
</script>
