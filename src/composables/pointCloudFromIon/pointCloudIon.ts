import {
  Cesium3DTileset,
  Color,
  ShadowMode
} from 'cesium'
import { ModelNorway } from '@/enums/model'
import useViewer from '../viewer/viewer'

export default function usePointCloudIon() {
  const viewer = useViewer().getCesium()

  const generatePointCloud = async () => {
    try {
      if (!viewer) throw new Error('Empty viewer')
      let pointSquare: Cesium3DTileset|null = null
      for await (const assetId of ModelNorway) {
        pointSquare = await Cesium3DTileset.fromIonAssetId(assetId, {
          outlineColor: Color.fromCssColorString('black'),
          showOutline: true,
          shadows: ShadowMode.ENABLED,
        })
        pointSquare.pointCloudShading.attenuation = true
        viewer.scene.primitives.add(pointSquare)
      }
      if (pointSquare) await viewer.zoomTo(pointSquare)
      
    } catch (er) {
      console.error(er)
    }
  }

  return {
    generatePointCloud,
  }
}
