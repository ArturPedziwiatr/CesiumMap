<script setup lang="ts">
import useGeoJSONLoader from '@/composables/geojson/GeoJSONLoader';
import { computed } from 'vue';

const { getSources, toggleSourceVisibility } = useGeoJSONLoader()

const sources = computed(() => getSources());
</script>
<template>
  <div v-for="[alias] in sources" :key="alias">
    <button @click="toggleSourceVisibility(alias)">
      {{ alias }}
    </button>
  </div>
</template>
