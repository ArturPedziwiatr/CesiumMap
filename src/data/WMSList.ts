//######## Badeplasser - WMS	Oslo kommune ########
export interface IWMSList {
  name: string
  range?: number[]
  categories: string[]
  servers: Record<string, string[]>
  
}
export const NorwayWMS: IWMSList = {
  name: 'Norway',
  range: [0, 0, 50],
  categories: [
    'Cartography',
    'Institute for bioeconomy',
    'Environment Agency',
    'The tax authority',
    'The Species Data Bank',
    'Institute of Marine Research',
    'Mineral Management',
    'Commune',
  ],
  servers: {
    Cartography: [
      'https://wms.geonorge.no/skwms1/wms.adm_enheter_historisk',
      'https://wms.geonorge.no/skwms1/wms.adm_enheter2',
      'https://kart2.miljodirektoratet.no/arcgis/services/WMS/AdministrativeOmraaderOGC/MapServer/WMSServer',
      'https://openwms.statkart.no/skwms1/wms.arctic_ahdr',
      'https://openwms.statkart.no/skwms1/wms.arctic_physiography',
      'https://openwms.statkart.no/skwms1/wms.arctic_adm',
    ],
    Statistics: ['https://wms.geonorge.no/skwms1/wms.arealbruk'],
    'Institute for bioeconomy': [
      'https://wms.nibio.no/cgi-bin/ar250',
      'https://wms.nibio.no/cgi-bin/ar50_2',
      'https://wms.nibio.no/cgi-bin/ar5forvaltning2',
      'https://wms.nibio.no/cgi-bin/ar5oppdateringsbehov',
      'https://wms.nibio.no/cgi-bin/ar5',
    ],
    'Environment Agency': [
      'https://kart.miljodirektoratet.no/arcgis/services/anadrome_laksefisk/MapServer/WMSServer',
      'https://kart.miljodirektoratet.no/arcgis/services/artnasjonal2/MapServer/WMSServer',
      'https://kart.miljodirektoratet.no/arcgis/services/artfunksjon/MapServer/WMSServer',
      'https://kart.miljodirektoratet.no/arcgis/services/avlop/MapServer/WMSServer',
    ],
    'The tax authority': [
      'https://openwms.statkart.no/skwms1/wms.arbeidsgiveravgiftsoner',
    ],
    'The Species Data Bank': [
      'https://kart.artsdatabanken.no/WMS/artskartfa.aspx',
      'https://kart.artsdatabanken.no/WMS/artskart.aspx',
    ],
    'Institute of Marine Research': [
      'https://kart.hi.no/mareano/mareano_biologi/korallobservasjoner_video/wms',
      'https://kart.hi.no/mareano/mareano_biologi/svamper_video/wms',
      'https://kart.hi.no/mareano/mareano_biologi/arter_video/wms',
      'https://kart.hi.no/data/',
      'https://kart.hi.no/data/utbredelseskart/wms/ows',
    ],
    'Mineral Management': [
      'https://kart.dirmin.no/dirmin/services/GruvesikringsregisterBeta/MapServer/WmsServer',
    ],
    Commune: [
      'https://kart.dirmin.no/dirmin/services/GruvesikringsregisterBeta/MapServer/WmsServer',
    ],
  },
}
