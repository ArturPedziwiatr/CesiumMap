<template>
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
          <div class="cesium-navigation-help-details">Left click + drag</div>
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
          <div class="cesium-navigation-help-details">Mouse wheel scroll</div>
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
