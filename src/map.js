const db = require('electron-db');
const electron = require('electron');
const path = require('path');
const directory = path.join(__dirname, '/../Data')
const app  = electron.app || electron.remote.app;

//Declare a map
var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-100.642,39.327]),
      zoom: 5
    })
  });
defaultPopUp();


//Default pop up when the program first started
function defaultPopUp(){
  //Get default architectures info
  var table;
  db.getAll('Architectures', directory, (succ,data) => {
    var i;
    console.log(data);
    table = data;
  })

  //Adding default pop-up
  for (i=0; i<table.length;i++){
      //Create new pop up div
    var newDiv = document.createElement('div');
    console.log("Create new div");
    newDiv.setAttribute("class", "ol-popup");
    //Create content and closer
    var newContent = document.createElement('div');
    var newAnchor = document.createElement('a');
    newAnchor.href="#";
    newAnchor.setAttribute("class","ol-popup-closer");
    newDiv.appendChild(newAnchor);
    newDiv.appendChild(newContent); 
    //Create map overlay
    var overlay = new ol.Overlay({
      element: newDiv
    });
    console.log(table[i].lon);
    overlay.setPosition(ol.proj.fromLonLat([table[i].lon,table[i].lat]));
    var name = table[i].name.toString();
    newContent.innerHTML = name + "<br>" + table[i].Location.toString();
    map.addOverlay(overlay);
  }
}

//This is testing part for clicking pop up 

// map.on('singleclick', function(evt) {
//   var coordinate = evt.coordinate;
//   var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));
//   // var hdms = toStringHDMS(toLonLat(coordinate));
  
//   newContent.innerHTML = '<p>You clicked here:</p><code>' + hdms +
//       '</code>';
//   overlay.setPosition(coordinate);
//   map.addOverlay(overlay);
// });

