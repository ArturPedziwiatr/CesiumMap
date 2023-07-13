import { Viewer, Terrain } from 'cesium'

class ViewerCustom {
  viewer: Viewer|null = null

  public construct() {
    if(!this.viewer)
      this.viewer = new Viewer('cesiumMap', {
        terrain: Terrain.fromWorldTerrain(),
      })
  }

  public get = ():Viewer => ( viewer as Viewer )
}

export const viewer = new ViewerCustom().get()
