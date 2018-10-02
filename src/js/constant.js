global.camera, global.scene, global.renderer, global.earth, global.cloud, global.earthGroup, global.locationGroup;
global.container = document.getElementById("container");
global.earthRadius = 15;
global.cityRadius = earthRadius * 1.06;
global.LOCATIONS = [{
    name: 'SHANGHAI',
    coord: [30.40, 120.52] // 30° 40' N, 120° 52' E
  }, {
    name: 'BEIJING',
    coord: [39.92, 116.46] // 39° 92' N, 116° 46' E
  }, {
    name: 'WASHINGTON',
    coord: [38.91, -77.02] // 38° 91' N, 77° 02' W
  }, {
    name: 'MELBOURNE',
    coord: [-37.50, 144.58] // 37° 50' S, 144° 58' E
  }, {
    name: 'RIO',
    coord: [-22.54, -43.12] // 22° 54' S，43° 12' W
  }, 
  {
    name: 'LONDON',
    coord: [51.30, 0.5] // 22° 54' S，43° 12' W
  }
]