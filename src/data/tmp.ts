const tmp = {
  name: 'Norway',
  range: [ 0, 0, 50],
  categorys: ['Administration', 'Mineral Management'],
  servers: [
    {
      category: 'Cartography',
      wms: [
        'https://wms.geonorge.no/skwms1/wms.adm_enheter_historisk',
        'https://wms.geonorge.no/skwms1/wms.adm_enheter2',
        'https://kart2.miljodirektoratet.no/arcgis/services/WMS/AdministrativeOmraaderOGC/MapServer/WMSServer',
        'https://openwms.statkart.no/skwms1/wms.arctic_ahdr',
        'https://openwms.statkart.no/skwms1/wms.arctic_physiography',
      ],
    },
    {
      category: 'Statistics',
      wms: [
        'https://wms.geonorge.no/skwms1/wms.arealbruk',
      ],
    },
    {
      category: 'The Norwegian Environment Agency',
      wms: [
        'https://kart.miljodirektoratet.no/arcgis/services/anadrome_laksefisk/MapServer/WMSServer',
      ],
    },
    {
      category: 'The tax authority',
      wms: [
        'https://openwms.statkart.no/skwms1/wms.arbeidsgiveravgiftsoner',
      ],
    },
    {
      category: 'Mineral Management',
      wms: [
        'https://kart.dirmin.no/dirmin/services/GruvesikringsregisterBeta/MapServer/WmsServer',
      ],
    }
  ]
}