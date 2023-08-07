<script setup lang="ts">
import ButtonList from '@/buttons/ButtonList.vue'
import AuthSection from '@/auth/AuthSection.vue'
import useGeoJSONLoader from '@Func/geojson/GeoJSONLoader'
import ButtonCustom from '@/buttons/ButtonCustom.vue'
import useDynamicLayers from '@Func/layers/layers'
import { ref } from 'vue'
import useSidebar, { SidebarsType } from '@Func/sidebar/sidebar'
import AddWMSDialog from '@/dialog/AddWMSDialog.vue'
import { ElDialog } from 'element-plus'
import useLayers from '@Func/cesium/layers.ts'

const sources = useGeoJSONLoader(),
  dynamicLayres = useDynamicLayers(),
  menu = useSidebar(),
  dialogVisible = ref(false),
  component = ref(),
  title = ref(''),
  tmpLay =  useLayers()

const openDialog = (arg1: any, arg2: string) => {
  component.value = arg1
  title.value = arg2
  dialogVisible.value = true
}
</script>

<template>
  <AuthSection class="mt-4">
    <ButtonList
      icon="layer-group"
      text="Layers"
      :checked="true"
      :back="true"
      @back-to="menu.changeSidebar(SidebarsType.PRIMARY)"
    >
      <div :key="dynamicLayres.refresToken.value">
        <ButtonCustom
          v-for="layer of tmpLay.getLayers()"
          :key="layer"
          :value="dynamicLayres.ifLayerIsActive(layer)"
          @on-click="tmpLay.visibleLayres(layer)"
        >
          {{ layer }}
        </ButtonCustom>
        <ButtonCustom
          v-for="layer of dynamicLayres.getAllLayers()"
          :key="layer"
          :value="dynamicLayres.ifLayerIsActive(layer)"
          @on-click="dynamicLayres.visibleLayres(layer)"
        >
          {{ layer }}
        </ButtonCustom>
      </div>
      <ButtonCustom
        v-for="source of sources.getSources()"
        :key="source"
        @on-click="sources.visibleSource(source)"
      >
        {{ source }}
      </ButtonCustom>
    </ButtonList>
    <ButtonCustom @on-click="openDialog(AddWMSDialog, 'Add WMS layer')" :check="false">
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
</style>
