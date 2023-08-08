<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  check: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['onClick'])
const status = ref(props.value)
</script>

<template>
  <button :active="status && check" @click="status = !status; emit('onClick', { ...$event, status })">
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

  &[active=true],
  &:hover {
    background: $primary-color;
    color: $toggle-color;
  }

  & :deep(svg) {
    font-size: $sidebar-icon-menu-font;
    .sidebar[collapsed=true] & {
      margin: 0 auto;
    }
  }

  & :deep(p) {
    font-size: $sidebar-btn-menu-font;
    font-weight: $weight-6;
    margin-left: 1rem;
    transition: $tran-04;

    .sidebar[collapsed=true] & {
      display: none;
    }
  }
}
</style>
