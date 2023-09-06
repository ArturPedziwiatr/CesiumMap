import {
  Cesium3DTileset,
  Cartesian3,
  NearFarScalar,
} from 'cesium'
import { ModelNorway, pointCloudIdsPL21, pointCloudIdsBaerum12 } from '@/enums/model'
import useViewer from '../viewer/viewer'
import cesiumSVG from '@/assets/icon/cesium.svg'

export default function usePointCloud() {
  const viewer = useViewer().getCesium()
  const pointCloudCollection = new Map<string, Cesium3DTileset>()
  const entityID = ['presentation-template-id1', 'presentation-template-id2']

  const generateNor = async () => {
    try {
      if (!viewer) throw new Error('Empty viewer')
      let pointSquare: Cesium3DTileset | null = null
      for await (const assetId of ModelNorway) {
        pointSquare = await Cesium3DTileset.fromIonAssetId(assetId, {})
        pointSquare.pointCloudShading.attenuation = true
        if (!pointCloudCollection.has(assetId.toString())) {
          pointCloudCollection.set(assetId.toString(), pointSquare)
          viewer.scene.primitives.add(pointSquare)
        }
      }
      console.log(pointSquare)
      if (pointSquare) await viewer.zoomTo(pointSquare)
    } catch (er) {
      console.error(er)
    }
  }

  const generatePL = async (module: string, pointCloudIds: string[]) => {
    try {
      if (!viewer) throw new Error('Empty viewer')
      for await (const assetId of pointCloudIds) {
        if (pointCloudCollection.has(assetId)) {
          const assets = pointCloudCollection.get(assetId)
          if (assets) {
            assets.show = !assets.show
            continue
          }
        }
        const pointSquare = await Cesium3DTileset.fromUrl(
          `http://localhost:8000/${module}/${assetId}/tileset.json`
        )
        pointSquare.pointCloudShading.attenuation = true
        if (!pointCloudCollection.has(assetId)) {
          pointCloudCollection.set(assetId, pointSquare)
          viewer.scene.primitives.add(pointSquare)
          if (pointSquare) await viewer.zoomTo(pointSquare)
        }
      }
    } catch (er) {
      console.error(er)
    }
  }

  const initLidarLayer = () => {
    if (!viewer) return
    if (viewer.entities.getById(entityID[0])) {
      viewer.entities.removeById(entityID[0])
      viewer.entities.removeById(entityID[1])
      return
    }
    viewer.entities.add({
      id: entityID[0],
      position: Cartesian3.fromDegrees(19.46, 51.77),
      billboard: {
        image: cesiumSVG,
        scaleByDistance: new NearFarScalar(1.5e2, 0.04, 1.5e3, 0.1),
        heightReference: 1
      },
      properties: {
        onClick: () => generatePL('pl-2021-lidar', pointCloudIdsPL21)
      }
    })
    viewer.entities.add({
      id: entityID[1],
      position: Cartesian3.fromDegrees(10.495085316097462, 59.94745804102812),
      billboard: {
        image: cesiumSVG,
        scaleByDistance: new NearFarScalar(1.5e2, 0.04, 1.5e3, 0.1),
        heightReference: 1
      },
      properties: {
        onClick: () => generatePL('baerum-2012-lidar', pointCloudIdsBaerum12)
      }
    })
  }

  generatePL('tmp', ['result2'])
  
  return {
    generateNor,
    generatePL,
    initLidarLayer
  }
}
