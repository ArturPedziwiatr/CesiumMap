<script setup lang="ts">
import { ref } from 'vue'
defineProps({
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})

const active = ref(false)
const btnList = ref<HTMLElement>()
const action = () => {
  active.value
    ? btnList.value?.classList.remove('expand')
    : btnList.value?.classList.add('expand')
  active.value = !active.value
}
</script>

<template>
  <div class="wrapper">
    <div class="collapsible">
      <input type="checkbox" id="collapsible-head" />
      <label for="collapsible-head">
        <Icon :icon="['fas', icon]" />
        <p>{{ text }}</p>
      </label>
      <div class="collapsible--text">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  padding-top: 0.8rem;

  & .collapsible {
    max-width: 450px;
    overflow: hidden;
    font-weight: 500;

    &--text {
      max-height: 1px;
      overflow: hidden;
      position: relative;
      top: -100%;
      opacity: 0.5;
      transition: $tran-03;
    }

    & input {
      display: none;

      &:checked {
        & ~ .collapsible--text {
          max-height: 300px;
          opacity: 1;
          top: 0;
        }

        & + label {
          color: $primary-color;
        }
      }
    }

    & label {
      position: relative;
      font-weight: 600;
      display: flex;
      align-items: center;
      color: $text-color;
      cursor: pointer;
      padding: 15px 0;
      z-index: 1;
      font-size: 20px;
      background: $sidebar-color;

      &:hover {
        color: $primary-color;
      }

      & p {
        margin-left: 1rem;
      }

      & svg {
        font-size: 24px;
      }
    }
  }
}
</style>
