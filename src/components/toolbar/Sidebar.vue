<script setup lang="ts">
import ButtonList from '@/buttons/ButtonList.vue'
</script>

<template>
  <div class="sidebar">
    <header>
      <img src="../../assets/icon/cesium.svg" alt="logo" />
      <h1>CESIUM ion</h1>
      <div class="toggle">
        <Icon :icon="['fas', 'chevron-right']" />
      </div>
    </header>

    <div class="menu">
      <ButtonList icon="scroll" text="Presentation">
        <button class="menu--btn">Points generate</button>
        <button class="menu--btn">Animation generate</button>
        <button class="menu--btn">Generate building</button>
        <button class="menu--btn">Bump to Sweden</button>
        <button class="menu--btn">Add Hydrography Bores</button>
        <button class="menu--btn">Modum - Eiker 1965</button>
        <button class="menu--btn">NASA</button>
        <button class="menu--btn">Action</button>
      </ButtonList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  background: $sidebar-color;
  width: $sidebar-width-expanded;
  height: 100%;
  padding: 10px 14px;

  & header {
    display: flex;
    align-items: center;
    position: relative;

    & img {
      width: 40px;
      height: 40px;
      background: $primary-color;
      padding: 0.2rem;
      border-radius: 4px;
    }

    & h1 {
      margin-left: 8px;
      font-size: 24px;
      font-weight: 600;
      vertical-align: middle;
      color: $text-color;
    }

    & .toggle {
      position: absolute;
      top: 50%;
      right: -25px;
      transform: translateY(-50%);
      height: 25px;
      width: 25px;
      background: $primary-color;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: $sidebar-color;
      font-size: 18px;
    }
  }

  & .menu {
    &--btn {
      width: 100%;
      background: transparent;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 0;

      &[active],
      &:hover {
        background: $primary-color;
        color: $toggle-color;
      }
    }
  }
}
</style>
