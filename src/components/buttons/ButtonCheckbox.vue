<script setup lang="ts">
import { uniqueId } from 'lodash'
import { ref } from 'vue'

const id = uniqueId()
const props = defineProps({
  value: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const checkbox = ref(props.value)

defineEmits(['update'])
</script>

<template>
  <div class="wrapper">
    <input
      type="checkbox"
      :id="`checkbox-${id}`"
      v-model="checkbox"
      v-on:change="$emit('update', checkbox)"
    />
    <label :for="`checkbox-${id}`">
      <slot />
    </label>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  
  & input {
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:hover {

      & + label {
        color: $btn-hover-color;
      }
    }
    
    &:checked {
      accent-color: $primary-color;
      
      & + label {
        color: $btn-hover-color;
      }
    }
  }
  
  & label {
    cursor: pointer;
    color: $text-color;
    z-index: 1;
    padding: 0.3rem 0;
    font-size: $sidebar-btn-menu-font;
    width: 100%;

    &:hover {
      color: $btn-hover-color;
    }

    & p {
      margin-left: 0.6rem;
    }

  }
}
</style>
