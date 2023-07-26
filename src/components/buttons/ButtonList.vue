<script setup lang="ts">
import { uniqueId } from 'lodash'
const id = uniqueId()
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

const expanded = () => document.querySelector('.sidebar')?.removeAttribute('collapsed')
</script>

<template>
  <div class="wrapper" @click="expanded">
    <div class="collapsible">
      <input type="checkbox" :id="`collapsible-${id}`" />
      <label :for="`collapsible-${id}`">
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
  & .collapsible {
    width: 100%;
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
          padding-left: 16px;
        }

        & + label {
          color: $btn-hover-color;
        }
      }
    }

    & label {
      position: relative;
      font-weight: $weight-6;
      display: flex;
      align-items: center;
      color: $text-color;
      cursor: pointer;
      z-index: 1;
      padding: 0.5rem 0.4rem;
      font-size: $sidebar-btn-menu-font;
      background: $sidebar-color;

      &:hover {
        color: $btn-hover-color;
      }

      & p {
        margin-left: 1rem;
      }

      & svg {
        font-size: $sidebar-icon-menu-font;
      }
    }
  }
}
</style>
