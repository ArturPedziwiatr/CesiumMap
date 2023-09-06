// import {
//   Cesium3DTileset,
//   Cesium3DTileStyle,
//   StyleExpression,
//   Color,
//   ShadowMode,
//   Material,
// } from 'cesium'
// import { ModelNorway } from '@/enums/model'
// import useViewer from '../viewer/viewer'

// export default function usePointCloudIon() {
//   const viewer = useViewer().getCesium()

//   const generatePointCloud = async () => {
//     try {
//       if (!viewer) throw new Error('Empty viewer')
//       ModelNorway.forEach(async val => {
//         const pointSquare = await Cesium3DTileset.fromIonAssetId(val, {
//           // showOutline: true,
//           outlineColor: Color.fromCssColorString('black'),
//           showOutline: true,
//           shadows: ShadowMode.ENABLED,
//           // dynamicScreenSpaceError: true,
//           // dynamicScreenSpaceErrorFactor: 20,
//           // dynamicScreenSpaceErrorDensity: 10.20278,
//           // preferLeaves: true,
//           // maximumMemoryUsage: 2048,
//           // cullWithChildrenBounds: false,
//           // cullRequestsWhileMoving: false,
//           // skipLevelOfDetail: true
//         })
//         // pointSquare.style = generatePointStyle()
//         pointSquare.pointCloudShading.attenuation = true
//         viewer.scene.primitives.add(pointSquare)
//         await viewer.zoomTo(pointSquare)
//       })

//       var customMaterial = new Material({
//         fabric: {
//           type: 'Custom',
//           uniforms: {
//             u_myUniform: 1.0,
//           },
//           source: {
//             vertexShader: `
//                   in vec3 position;
//                   in vec3 normal;
//                   in vec2 texCoord;
                  
//                   uniform mat4 u_modelViewMatrix;
//                   uniform mat4 u_projectionMatrix;
                  
//                   out vec3 v_normal;
//                   out vec2 v_texCoord;
                  
//                   void main() {
//                       gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(position, 1.0);
//                       v_normal = normal;
//                       v_texCoord = texCoord;
//                   }`,
//             fragmentShader: `
//                   precision mediump float;

//                   out vec3 v_normal;
//                   out vec2 v_texCoord;

//                   uniform sampler2D u_shadowMap; // Shadow map texture
//                   uniform mat4 u_shadowMatrix;   // Matrix to transform vertex to shadow map space

//                   void main() {
//                       // Transform vertex to shadow map space
//                       vec4 shadowCoord = u_shadowMatrix * vec4(v_texCoord, 0.0, 1.0);

//                       // Calculate depth from shadow map
//                       float shadowDepth = texture2D(u_shadowMap, shadowCoord.xy).r;

//                       // Compare depth to shadow map depth
//                       float visibility = (shadowCoord.z - 0.005) > shadowDepth ? 1.0 : 0.5;

//                       // Apply lighting and visibility to color
//                       gl_FragColor = vec4(v_normal * visibility, 1.0);
//                   }
//                   `,
//           },
//         },
//       })
//       // const tmp = new PostProcessStage({
//       //   fragmentShader: fragmentShaderSource,
//       //   uniforms: {
//       //     highlight: function () {
//       //       return new Color(1.0, 0.0, 0.0, 0.5)
//       //     },
//       //   },
//       // })
//       // console.log(tmp)

//       // viewer.scene.postProcessStages.add(tmp)
//       const fs = `
//         uniform sampler2D colorTexture;
//         in vec2 v_textureCoordinates;
//         uniform float scale;
//         uniform vec3 offset;
//         void main() {
//             vec4 color = texture(colorTexture, v_textureCoordinates);
//             out_FragColor = vec4(color.rgb * scale + offset, 1.0);
//         }`
//       // viewer.scene.postProcessStages.add(new PostProcessStage({
//       //     fragmentShader : fs,
//       //     uniforms : {
//       //         scale : 1.1,
//       //         offset : function() {
//       //             return new Cartesian3(0.1, 0.2, 0.3);
//       //         }
//       //     }
//       // }));
//     } catch (er) {
//       console.error(er)
//     }
//   }

//   const generatePointStyle = (): Cesium3DTileStyle => {
//     const style = new Cesium3DTileStyle()
//     style.pointSize = 1
//     style.pointOutlineWidth = new StyleExpression("['${height} > 2', '1.3']")

//     style.pointOutlineColor = Color.fromCssColorString('black')
//     // style.pointSize = {
//     //   conditions: [
//     //     ['${height} > 2', '1.3'],
//     //     ['true', '2.0'],
//     //   ],
//     // }
//     // style.backgroundColor = 'color("black")'
//     // style.pointOutlineColor = 'color("black")'
//     // style.pointOutlineWidth = 2.0

//     return style
//   }

//   return {
//     generatePointCloud,
//   }
// }
