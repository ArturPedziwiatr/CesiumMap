<script setup lang="ts">
import { ref } from 'vue'

const sliderInput = ref<HTMLInputElement>()
const firstView = ref<HTMLElement>()
const dragLine = ref<HTMLElement>()
const onChange = () => {
  if (!dragLine.value || !firstView.value || !sliderInput.value) return
  dragLine.value.style.left = `${sliderInput.value.value}%`
  firstView.value.style.width = `${sliderInput.value.value}%`
}
</script>

<template>
  <div class="wrapper">
    <div class="views">
      <div ref="firstView" class="first--view">
        <slot name="front" />
      </div>
      <div class="second--view">
        <slot name="back" />
      </div>
    </div>
    <div class="slider">
      <div ref="dragLine" class="drag-line">
        <span></span>
      </div>
      <input
        ref="sliderInput"
        type="range"
        min="0"
        max="100"
        value="50"
        @input="onChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  height: 100vh;
  width: calc(100vw - $sidebar-width-collapsed);
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: fixed;
  right: 0;

  .views {
    height: 100%;
    width: 100%;
    display: flex;

    .first--view {
      height: 100%;
      width: 50%;
      background: #266448;
      position: relative;
      z-index: 20;
      overflow-x: hidden;
    }

    .second--view {
      height: 100%;
      width: 100%;
      background: #bd8317;
      position: absolute;
      z-index: 10;
    }
  }

  .slider {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 99;

    input {
      width: 100%;
      height: 100vh;
      outline: none;
      background: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;

      &::-webkit-slider-thumb {
        width: 3px;
        height: 100vh;
        background: $primary-color;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: col-resize;
      }

      .drag-line {
        width: 1px;
        height: 486px;
        position: absolute;
        left: 49.85%;
        pointer-events: none;

        &::before,
        &::after {
          position: absolute;
          content: '';
          width: 100%;
          height: 222px;
          background: #fff;
        }

        &::before {
          top: 0;
        }

        &::after {
          bottom: 0;
        }

        span {
          height: 42px;
          width: 42px;
          border: 3px solid #fff;
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);

          &::before,
          &::after {
            position: absolute;
            content: '';
            top: 50%;
            border: 10px solid transparent;
            border-bottom-width: 0px;
            border-right-width: 0px;
            transform: translate(-50%, -50%) rotate(45deg);
          }

          &::before {
            left: 30%;
            border-left-color: #fff;
          }

          &::after {
            left: 70%;
            border-top-color: #fff;
          }
        }
      }
    }
  }
}
</style>
