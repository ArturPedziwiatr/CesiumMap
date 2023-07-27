<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'checkbox',
  },
})
const btn = ref<HTMLElement>()
const emit = defineEmits(['onClick'])
const onClick = (event: MouseEvent) => {
  if (!btn.value) return
  if (props.type === 'checkbox') {
    if (btn.value.getAttribute('active')) {
      btn.value.removeAttribute('active')
    } else {
      btn.value.setAttribute('active', 'true')
    }
  }

  emit('onClick', event)
}
</script>

<template>
  <button ref="btn" @click="onClick($event)">
    <slot />
  </button>
</template>

<style scoped lang="scss">
button {
  cursor: pointer;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: $tran-03;
  text-align: left;
  display: flex;
  padding: 0.5rem 0.4rem;
  margin: 0.3rem 0;
  color: $text-color;

  &.primary {
    margin-top: 8px;
    color: $text-color;
  }

  &[active],
  &:hover {
    background: $primary-color;
    color: $toggle-color;
  }

  & :deep(svg) {
    font-size: $sidebar-icon-menu-font;
  }

  & :deep(p) {
    font-size: $sidebar-btn-menu-font;
    font-weight: $weight-6;
    margin-left: 1rem;
  }
}
</style>
