<script setup lang="ts">
import ButtonGroup from '@component/buttons/ButtonGroup.vue'
import ButtonList from '@component/buttons/ButtonList.vue'
import useCesiumPresentation from '@function/cesium/cesiumPresentation'
import use3DTileset from '@function/tileset3D/3DTileset'
import useTerrains from '@function/terrain/terrain'
import AuthSection from '@component/auth/AuthSection.vue'
import ButtonCustom from '@component/buttons/ButtonCustom.vue'
import useSidebar, { SidebarsType } from '@function/sidebar/sidebar'
import usePointCloud from '@function/pointCloudFromIon/pointCloudIon'

const actions = useCesiumPresentation(),
  tileset = use3DTileset(),
  maps = useTerrains(),
  menu = useSidebar(),
  pointCloud = usePointCloud()
</script>

<template>
  <div>
    <ButtonCustom class="primary" @on-click="pointCloud.initLidarLayer()">
      <Icon :icon="['fas', 'house']" />
      <p>Lidar</p>
    </ButtonCustom>
    <ButtonCustom class="primary" @on-click="actions.bumpToHome()">
      <Icon :icon="['fas', 'house']" />
      <p>View Home2</p>
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
      <ButtonCustom @on-click="menu.changeSidebar(SidebarsType.LAYERS)">
        <Icon :icon="['fas', 'layer-group']" />
        <p>Layers</p>
      </ButtonCustom>
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
    </AuthSection>
  </div>
</template>

<style scoped lang="scss">
table {
  margin-left: -16px;
}

.cesium-navigation-help-details {
  font-size: 12px;
  color: $text-color;
}
</style>
