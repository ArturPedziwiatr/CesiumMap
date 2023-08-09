<script setup lang="ts">
import AuthSection from '@/auth/AuthSection.vue'
import ButtonCustom from '@/buttons/ButtonCustom.vue'
import InputCustom from '@/buttons/InputCustom.vue'
import useDynamicLayers from '@Func/layers/layers'
import LoadSection from '@/animation/LoadSection.vue'
import { ref } from 'vue'
import ButtonCheckbox from '@/buttons/ButtonCheckbox.vue'

const dynamicLayres = useDynamicLayers(),
  layers = ref<string[]>([]),
  alias = ref(''),
  group = ref(false)

const addOrRemoveLayer = (lay: string) => {
  if (layers.value.includes(lay))
    layers.value = layers.value.filter(x => x != lay)
  else layers.value.push(lay)
}
const clear = () => {
  layers.value.length = 0
  alias.value = ''
  emit('close')
}

const emit = defineEmits(['close'])
</script>

<template>
  <AuthSection class="mt-4">
    <InputCustom
      @on-click="dynamicLayres.addWMSServer($event)"
      icon="magnifying-glass"
      placeholder="WMS url..."
    />
    <div class="grid--box">
      <LoadSection :loading="dynamicLayres.loading.value" class="box">
        <ButtonCheckbox
          v-for="layer of dynamicLayres.getWMSLayers()"
          :key="layer.title"
          @update="addOrRemoveLayer(layer.name)"
        >
          {{ layer.title }}
        </ButtonCheckbox>
        <p v-if="dynamicLayres.error.value" class="error-msg" >{{ dynamicLayres.error.value }}</p>
      </LoadSection>
      <div class="setting--box">
        <div class="temp">
          <InputCustom @model-value="alias = $event" placeholder="Layre name..." />
          <ButtonCheckbox
            :value="group"
            @update="group = $event"
          >
          Add to group
          </ButtonCheckbox>
        </div>
        <ButtonCustom
          type="off"
          @click="dynamicLayres.addLayerStrategy(layers, group, alias); clear()"
        >
          Add Layer
        </ButtonCustom>
      </div>
    </div>
  </AuthSection>
</template>

<style scoped lang="scss">
.grid--box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 200px;
  gap: 1rem;
  margin-top: 1rem;

  & .box {
    height: 180px;
    width: auto;
    overflow-x: auto;
    border-top: 1px solid $primary-color;
    border-bottom: 1px solid $primary-color;
    padding: 0.4rem 0.4rem;
    margin: 1rem 0;
    box-sizing: content-box;

    & .error-msg {
      color: $error-msg-color;
      font-size: $error-msg-font;
      text-align: center;
    }
  }

  & .setting--box {
    margin: 1rem 0;
    height: 89%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & .temp {
      display: block;
    }
  }
}
</style>
