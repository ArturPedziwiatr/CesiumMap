<script setup lang="ts">
import ButtonSearch from '@/buttons/ButtonSearch.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import ButtonLogin from '@/buttons/ButtonLogin.vue'
import { ref } from 'vue'
import ButtonGroup from '@/buttons/ButtonGroup.vue'
import ButtonList from '@/buttons/ButtonList.vue'
import useCesiumPresentation from '@Func/cesium/cesiumPresentation'
import use3DTileset from '@Func/tileset3D/3DTileset'
import useTerrains from '@Func/terrain/terrain'
import AuthSection from '@/auth/AuthSection.vue'
import ButtonCustom from '@/buttons/ButtonCustom.vue'
import InstructionsComponent from '@/toolbar/additional/InstructionsComponent.vue'

const { isAuthenticated, user } = useAuth0(),
  sidebar = ref<HTMLElement>(),
  toggle = ref<HTMLElement>(),
  actions = useCesiumPresentation(),
  tileset = use3DTileset(),
  maps = useTerrains()

const getInitials = (text: string | null | undefined) => (text ? text[0] : '')

const sidebarAction = () => {
  if (!sidebar.value) return
  if (sidebar.value.getAttribute('collapsed'))
    sidebar.value.removeAttribute('collapsed')
  else {
    sidebar.value.setAttribute('collapsed', 'true')
    const input = document.querySelectorAll(
      '.sidebar input[type="checkbox"]:checked'
    )
    Array.from(input).forEach((elem: any) => (elem.checked = false))
  }
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
      <ButtonCustom class="primary" @on-click="actions.bumpToHome()">
        <Icon :icon="['fas', 'house']" />
        <p>View Home</p>
      </ButtonCustom>
      <ButtonList icon="scroll" text="Presentation">
        <ButtonCustom @on-click="actions.importFlyingData()"
          >Points generate</ButtonCustom
        >
        <ButtonCustom @on-click="actions.createAnimate()"
          >Animation generate</ButtonCustom
        >
        <ButtonCustom @on-click="actions.createBuild()"
          >Generate building</ButtonCustom
        >
        <ButtonCustom @on-click="actions.bumpToSweden()"
          >Bump to Sweden</ButtonCustom
        >
      </ButtonList>
      <AuthSection>
        <ButtonList icon="mosque" text="3D Buildings">
          <div v-if="tileset.getLoaded()">
            <ButtonCustom
              v-for="tile of tileset.getTileset()"
              :key="tile"
              @on-click="tileset.visibleTileset(tile)"
            >
              {{ tile }}
            </ButtonCustom>
          </div>
        </ButtonList>
        <ButtonList icon="earth-americas" text="Terrain">
          <ButtonGroup
            type="terrain"
            @on-change="(e: string) => maps.visibleTerrain(e)"
          >
            <ButtonCustom type="off" terrain="off" active>OFF</ButtonCustom>
            <ButtonCustom
              type="off"
              v-for="map of maps.getTerrains()"
              :terrain="map"
            >
              {{ map }}
            </ButtonCustom>
          </ButtonGroup>
        </ButtonList>
        <ButtonList icon="circle-info" text="Instructions">
          <InstructionsComponent />
        </ButtonList>
      </AuthSection>
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

  &[collapsed='true'] {
    width: 78px;

    & h1,
    & p {
      display: none;
      opacity: 0;
    }

    & .toggle {
      transform: rotate(180deg);
    }
  }

  & .btn--login {
    margin-top: auto;
  }
}
</style>
