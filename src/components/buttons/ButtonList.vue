<script setup lang="ts">
import { uniqueId } from 'lodash'
import { ref } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false
  },
  src: {
    type: String,
    reguired: false
  },
  back: {
    type: Boolean,
    default: false
  }
})
const id = uniqueId()
const active = ref(props.checked)
defineEmits(['backTo'])
const expanded = () => {
  if ((document.getElementById(`collapsible-${id}`) as any).checked === false) 
    document.querySelector('.sidebar')?.removeAttribute('collapsed')
}
</script>

<template>
  <div class="wrapper" @click="expanded">
    <div class="collapsible">
      <input type="checkbox" :id="`collapsible-${id}`" v-model="active" />
      <label :for="`collapsible-${id}`">
        <img v-if="src" :src="src" alt="logo" />
        <Icon v-else-if="icon" :icon="['fas', icon]" />
        <p>{{ text }}</p>
        <Icon
          v-if="back"
          :icon="['fas', 'right-to-bracket']"
          class="icon-back"
          @click="$emit('backTo')"
        />
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
          max-height: 500px;
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

      & img {
        height: $sidebar-btn-menu-font;
        color: $text-color;
      }

      &:hover {
        color: $btn-hover-color;
      }

      & p {
        margin-left: 1rem;
        transition: $tran-04;
      }

      & svg {
        font-size: $sidebar-icon-menu-font;
      }

      & .icon-back {
        margin-left: auto;
        cursor: alias;
      }
    }
  }

  .sidebar[collapsed=true] & {
    & .collapsible {
      p {
        display: none;
      }

      svg {
        margin: 0 auto;
      }
    }
  }
}
</style>
