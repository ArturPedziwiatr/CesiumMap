<script setup lang="ts">
import ButtonGroup from '@/buttons/ButtonGroup.vue'
import ButtonList from '@/buttons/ButtonList.vue'
import ButtonSearch from '@/buttons/ButtonSearch.vue'
import useCesiumPresentation from '@Func/cesium/cesiumPresentation'
import useLayers from '@Func/cesium/layers'
import use3DTileset from '@Func/tileset3D/3DTileset'
import useTerrains from '@Func/terrain/terrain'
import { useAuth0 } from '@auth0/auth0-vue'
import ButtonLogin from '@/buttons/ButtonLogin.vue'
import AuthSections from '@/auth/AuthSections.vue'
import { ref } from 'vue'
import useGeoJSONLoader from '@Func/geojson/GeoJSONLoader'

const { isAuthenticated, user } = useAuth0(),
  actions = useCesiumPresentation(),
  tileset = use3DTileset(),
  layers = useLayers(),
  sources = useGeoJSONLoader(),
  maps = useTerrains(),
  sidebar = ref<HTMLElement>(),
  toggle = ref<HTMLElement>()

const activeLayer = (
  event: MouseEvent,
  key: string,
  layer: (key: string) => void
) => {
  const btn = event.target as HTMLElement
  if (btn.getAttribute('active')) {
    btn.removeAttribute('active')
  } else {
    btn.setAttribute('active', 'true')
  }
  layer(key)
}
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
      <button class="primary" @click="actions.bumpToHome()">
        <Icon :icon="['fas', 'house']" />
        <p>View Home</p>
      </button>
      <ButtonList icon="scroll" text="Presentation">
        <button @click="actions.importFlyingData()">Points generate</button>
        <button @click="actions.createAnimate()">Animation generate</button>
        <button @click="actions.createBuild()">Generate building</button>
        <button @click="actions.bumpToSweden()">Bump to Sweden</button>
      </ButtonList>
      <AuthSections>
        <ButtonList icon="layer-group" text="Layers">
          <button
            v-for="layer of layers.getLayers()"
            @click="e => activeLayer(e, layer, layers.visibleLayres)"
          >
            {{ layer }}
          </button>
          <button
            v-for="source of sources.getSources()"
            @click="e => activeLayer(e, source, sources.visibleSource)"
          >
            {{ source }}
          </button>
        </ButtonList>
        <ButtonList icon="mosque" text="3D Buildings">
          <div v-if="tileset.getLoaded()">
            <button
              v-for="tile of tileset.getTileset()"
              @click="e => activeLayer(e, tile, tileset.visibleTileset)"
            >
              {{ tile }}
            </button>
          </div>
        </ButtonList>
        <ButtonList icon="earth-americas" text="Terrain">
          <ButtonGroup
            type="terrain"
            @on-change="(e: string) => maps.visibleTerrain(e)"
          >
            <button terrain="off" active>OFF</button>
            <button v-for="map of maps.getTerrains()" :terrain="map">
              {{ map }}
            </button>
          </ButtonGroup>
        </ButtonList>
        <ButtonList icon="circle-info" text="Instructions">
          <table>
            <tbody>
              <tr>
                <td>
                  <img
                    src="http://localhost:3000/cesium/Widgets/Images/NavigationHelp/MouseLeft.svg"
                    width="48"
                    height="48"
                  />
                </td>
                <td>
                  <div class="cesium-navigation-help-pan">Pan view</div>
                  <div class="cesium-navigation-help-details">
                    Left click + drag
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <img
                    src="http://localhost:3000/cesium/Widgets/Images/NavigationHelp/MouseRight.svg"
                    width="48"
                    height="48"
                  />
                </td>
                <td>
                  <div class="cesium-navigation-help-zoom">Zoom view</div>
                  <div class="cesium-navigation-help-details">
                    Right click + drag, or
                  </div>
                  <div class="cesium-navigation-help-details">
                    Mouse wheel scroll
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <img
                    src="http://localhost:3000/cesium/Widgets/Images/NavigationHelp/MouseMiddle.svg"
                    width="48"
                    height="48"
                  />
                </td>
                <td>
                  <div class="cesium-navigation-help-rotate">Rotate view</div>
                  <div class="cesium-navigation-help-details">
                    Middle click + drag, or
                  </div>
                  <div class="cesium-navigation-help-details">
                    CTRL + Left/Right click + drag
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </ButtonList>
      </AuthSections>
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

    & table {
      margin-left: -16px;
    }

    & .cesium-navigation-help-details {
      font-size: 12px;
      color: $text-color;
    }

    & button {
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

      & svg {
        font-size: $sidebar-icon-menu-font;
      }

      & p {
        font-size: $sidebar-btn-menu-font;
        font-weight: $weight-6;
        margin-left: 1rem;
      }
    }
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
}
</style>
