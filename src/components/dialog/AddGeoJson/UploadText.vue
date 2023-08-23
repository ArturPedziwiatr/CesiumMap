<template>
  <el-input
    type="textarea"
    v-model="val"
    maxHeight="500"
    :rows="6"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref()
</script>
