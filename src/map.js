const db = require('electron-db');
const electron = require('electron');
const path = require('path');
const directory = path.join(__dirname, '/../Data')
const app  = electron.app || electron.remote.app;
const mongoose = require('mongoose');
require('dotenv/config');
const Architecture = require('../Data/Models/architecture');
//Connect to the database
async function connectToArchitectureData() {
  mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, reconnectTries: 5000})
  const table = await Architecture.find(function(err, data){
    return data;  
  })
  mongoose.disconnect();
  return table;
}

async function getArchitectureNames() {
  mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, reconnectTries: 5000})
  const table = await Architecture.find({}, 'name', function(err, data){
    return data;  
  })
  mongoose.disconnect();
  return table;
}

async function getOneArchitecture(architectureName) {
  mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, reconnectTries: 5000})
  const table = await Architecture.find({name: architectureName}, function(err, data){
    return data;  
  })
  mongoose.disconnect();
  return table;
}

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

//Create search bar
creatingSearchBox();

//Create default pop up
defaultPopUp();


//Default pop up when the program first started
async function defaultPopUp(){
   // const table = await Architecture.find();
  // console.log("Connection closed");
  //console.log(table);
  ///Get default architectures info
  console.log("Connecting to DB");
  const table = await connectToArchitectureData();
  if (table != undefined) {
    console.log("Connected");
  }

   //Portion of local database
  // var table;
  // db.getAll('default', directory, (succ,data) => {
  //   var i;
  //   console.log(data);
  //   table = data;
  // })

  //Adding default pop-up
  for (i=0; i<2;i++){
    //Create new pop up div
    var newDiv = document.createElement('div');
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
    overlay.setPosition(ol.proj.fromLonLat([table[i].lon,table[i].lat]));
    var name = table[i].name.toString();
    newContent.innerHTML = name + "<br>" + table[i].city.toString() + ", " + table[i].state.toString();
    map.addOverlay(overlay);
  }
}

function creatingSearchBox() {
  //Make search box 
  var searchBar = new ol.control.Control( {
    element: document.getElementById("searchBoxWrapper")
  })
  map.addControl(searchBar);
  //How 
}

//Create single pop up menu
async function createSinglePopUp(name) {
  const data = await getOneArchitecture(name);
  var popup = document.getElementsByClassName("ol-popup-closer") 
  while (popup.length != 0)
  {
    $('.ol-popup-closer').parent().parent().remove()
  }
  console.log(data);
  //Create new pop up div
  var newDiv = document.createElement('div');
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
  overlay.setPosition(ol.proj.fromLonLat([data[0].lon,data[0].lat]));
  var name = data[0].name.toString();
  newContent.innerHTML = name + "<br>" + data[0].city.toString() + ", " + data[0].state.toString();
  map.addOverlay(overlay);
}

//Search box click function (show list of entities when user click on search bar)
async function searching() {
  var elem = $(".result");
  var searchResults = document.getElementsByClassName("searchResults");
  //Local database
  // db.getField('default', directory, 'name', (succ,data) => {
  //   var i;
  //   table = data;
  //   console.log("list of architectures name"+ table);
  //   var searchResults = document.getElementsByClassName("searchResults");
  //   for (i in table) {
  //     let li = document.createElement('li');
  //     li.innerHTML = table[i];
  //     li.setAttribute("class", "result");
  //     searchResults[0].appendChild(li);
  //   }
  // })

  //MongoDB
  let table = await getArchitectureNames();
  if (searchResults[0].childElementCount == 0) {
    for (i in table) {
      let li = document.createElement('li');
      let name = table[i].name;
      li.innerHTML = name
      li.setAttribute("class", "result");
      li.addEventListener('click', function() {
        createSinglePopUp(name);
      })
      searchResults[0].appendChild(li);
    }
  }
}

function searchFilter() {
  var input = document.getElementById("searchInput");
  var filter = input.value.toUpperCase();
  var li = document.getElementsByClassName("result");
  var i

  for (i = 0; i<li.length; i++) {
    var textValue = li[i].textContent;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    }
    else {
      li[i].style.display = "none";
    }
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

