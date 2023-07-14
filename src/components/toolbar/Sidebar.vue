<script setup lang="ts">
import ButtonGroup from '@/buttons/ButtonGroup.vue'
import ButtonList from '@/buttons/ButtonList.vue'
import ButtonSearch from '@/buttons/ButtonSearch.vue'
import useCesiumPresentation from '@Func/cesium/cesiumPresentation'
import useLayers from '@Func/cesium/layers'
import use3DTileset from '@Func/tileset3D/3DTileset'
import useTerrains from '@Func/terrain/terrain'

const actions = useCesiumPresentation()
const layers = useLayers()
const tileset = use3DTileset()
const maps = useTerrains()
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
      <ButtonList icon="layer-group" text="Layers">
        <button
          v-for="layer of layers.getLayers()"
          @click="e => activeLayer(e, layer, layers.visibleLayres)"
        >
          {{ layer }}
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
}
</style>
@Func/terrain/3DTileset
