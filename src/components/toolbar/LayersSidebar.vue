<script setup lang="ts">
import AuthSection from '@component/auth/AuthSection.vue'
import ButtonCustom from '@component/buttons/ButtonCustom.vue'
import useDynamicLayers from '@function/layers/layers'
import { ref } from 'vue'
import AddWMSDialog from '@component/dialog/AddWMSDialog.vue'
import AddGeoJsonDialog from '@component/dialog/AddGeoJson/AddGeoJson.vue'
import { ElDialog } from 'element-plus'
import ButtonList from '@component/buttons/ButtonList.vue'
import WMSFromCategory from '@component/wms/WMSFromCategory.vue'

const dynamicLayres = useDynamicLayers(),
  dialogVisible = ref(false),
  component = ref(),
  title = ref('')

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
      <ButtonList :text="category" :key="category" v-slot="{ active }">
        <WMSFromCategory :category="category" v-if="active" />
      </ButtonList>
    </div>
    <ButtonCustom
      @on-click="openDialog(AddWMSDialog, 'Add WMS layer')"
      :check="false"
    >
      <Icon :icon="['fas', 'plus']" />
      <p>Add WMS layer</p>
    </ButtonCustom>

    <ButtonCustom @on-click="openDialog(AddGeoJsonDialog, 'Add GeoJSON')" :check="false">
      <Icon :icon="['fas', 'plus']" />
      <p>add geojson</p>
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

:deep(.buttonlist--text) {
  margin-left: 0 !important;
  font-size: $layersbar-text-font;
  font-weight: $weight-5;
}
</style>
