<script setup lang="ts">
import AuthSection from '@/auth/AuthSection.vue'
import useGeoJSONLoader from '@Func/geojson/GeoJSONLoader'
import ButtonCustom from '@/buttons/ButtonCustom.vue'
import useDynamicLayers from '@Func/layers/layers'
import { ref } from 'vue'
import AddWMSDialog from '@/dialog/AddWMSDialog.vue'
import { ElDialog } from 'element-plus'
import useLayers from '@Func/cesium/layers.ts'
import ButtonList from '@/buttons/ButtonList.vue'
import WMSFromCategory from '@/wms/WMSFromCategory.vue'

const sources = useGeoJSONLoader(),
  dynamicLayres = useDynamicLayers(),
  dialogVisible = ref(false),
  component = ref(),
  title = ref(''),
  tmpLay = useLayers()

const openDialog = (arg1: any, arg2: string) => {
  component.value = arg1
  title.value = arg2
  dialogVisible.value = true
}

defineEmits(['close'])
</script>

<template>
  <AuthSection class="layers--sidebar">
    <div class="sidebar--title">
      <p>Layers</p>
      <Icon :icon="['fas', 'xmark']" @click="$emit('close', false)" />
    </div>
    <div v-for="category in dynamicLayres.getWMSGeonorge()" :key="category">
      <ButtonList :text="category">
        <WMSFromCategory :category="category" />
      </ButtonList>
    </div>
    <ButtonCustom
      @on-click="openDialog(AddWMSDialog, 'Add WMS layer')"
      :check="false"
    >
      <Icon :icon="['fas', 'plus']" />
      <p>Add WMS layer</p>
    </ButtonCustom>

    <ElDialog v-model="dialogVisible" :title="title">
      <component :is="component" @close="dialogVisible = false" />
    </ElDialog>
  </AuthSection>
</template>

<style scoped lang="scss">
.box {
  height: 200px;
  width: auto;
  border-top: 1px solid $primary-color;
  border-bottom: 1px solid $primary-color;
  padding: 0.4rem 0;
  overflow-x: auto;
  margin: 1rem 0;
}

:deep(.el-dialog__body) {
  padding-top: 0;
}

.layers--sidebar {
  position: absolute;
  right: 0;
  top: 0;
  width: $sidebar-width-expanded;
  background-color: $sidebar-color;
  height: 100%;
  padding: 10px 14px;

  .sidebar--title {
    color: $primary-color;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-size: $sidebar-btn-menu-font;
    }

    svg {
      font-size: $sidebar-icon-menu-font;
      cursor: pointer;
    }
  }

  .layers--checkbox {
    max-height: 70%;
    overflow-y: auto;
  }
}
</style>
