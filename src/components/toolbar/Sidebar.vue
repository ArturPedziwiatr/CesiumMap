<script setup lang="ts">
import ButtonSearch from '@/buttons/ButtonSearch.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import ButtonLogin from '@/buttons/ButtonLogin.vue'
import { ref } from 'vue'
import PrimarySidebar from '@/toolbar/PrimarySidebar.vue'
import LayersSidebar from '@/toolbar/LayersSidebar.vue'
import useSidebar, { SidebarsType } from '@Func/sidebar/sidebar.ts'

const { isAuthenticated, user } = useAuth0(),
  sidebar = ref<HTMLElement>(),
  toggle = ref<HTMLElement>(),
  menu = useSidebar()

const getInitials = (text: string | null | undefined) => (text ? text[0] : '')

const sidebarAction = () => {
  if (!sidebar.value) return
  if(sidebar.value.getAttribute('collapsed'))
    sidebar.value.removeAttribute('collapsed')
  else sidebar.value.setAttribute('collapsed', 'true')
}
</script>

<template>
  <div ref="sidebar" class="sidebar">
    <header>
      <div v-if="isAuthenticated" class="userauth">
        <div class="image">
          <div>{{ getInitials(user!.name) ?? 'U' }}</div>
          <div>{{ getInitials(user!.family_name) }}</div>
        </div>
        <p>{{ user!.name }}</p>
      </div>
      <div v-else>
        <img src="../../assets/icon/cesium.svg" alt="logo" />
        <h1>CESIUM ion</h1>
      </div>
      <div ref="toggle" class="toggle" @click="sidebarAction">
        <Icon :icon="['fas', 'chevron-right']" />
      </div>
    </header>

    <ButtonSearch class="search" />
    <div class="menu">
      <Transition>
        <PrimarySidebar v-if="menu.activeSidebar.value === SidebarsType.PRIMARY" />
        <LayersSidebar v-else-if="menu.activeSidebar.value === SidebarsType.LAYERS" />
      </Transition>
    </div>
    <ButtonLogin class="btn--login" />

  </div>
</template>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  background: $sidebar-color;
  width: $sidebar-width-expanded;
  height: 100%;
  padding: 10px 14px;
  transition: $tran-04;

  & header {
    position: relative;

    & div {
      display: flex;
      align-items: center;

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
        color: $text-header-color;
      }
    }

    & .userauth {
      & .image {
        border-radius: 4px;
        background: $primary-color;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $sidebar-color;
      }

      & p {
        font-size: 18px;
        font-weight: 500;
        margin-left: 8px;
        color: $text-color;
      }
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
      transition: $tran-04;
    }
  }

  & .search {
    margin-top: 1rem;
  }

  & .menu {
    margin-top: 1rem;
    width: 90%;
    margin: 0 auto;
  }

  &[collapsed=true] {
    width: 78px;

    & h1,
    & p {
      opacity: 0
    }

    & .toggle {
      transform: rotate(180deg);
    }
  }

  & .btn--login {
    margin-top: auto;
  }

  :deep(.v-enter-active),
  :deep(.v-leave-active) {
    transition: opacity 0.3s ease;
  }

  :deep(.v-enter-active) {
    transition-delay: 0.3s;
  }

  :deep(.v-enter-from),
  :deep(.v-leave-to) {
    opacity: 0;
  }

  :deep(.v-enter-to),
  :deep(.v-leave-from) {
    opacity: 1;
  }
}
</style>
