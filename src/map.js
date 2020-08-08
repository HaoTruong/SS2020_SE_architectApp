const db = require('electron-db');
const electron = require('electron');
const path = require('path');
const directory = path.join(__dirname, 'data');
const remote = require('electron').remote;
const Menu = require('electron').menu;
var ipcRenderer = require('electron').ipcRenderer
const mongoose = require('mongoose');
const Architecture = require('../Data/models/architecture');
require('dotenv/config');
const DB_CONNECTION = "mongodb+srv://HT-Admin:Haotruong2@cluster0.fiqy6.mongodb.net/GeoArchitect?retryWrites=true&w=majority";
//Connect to the database
async function connectToArchitectureData() {
  mongoose.connect(DB_CONNECTION, {useNewUrlParser: true, reconnectTries: 5000})
  const table = await Architecture.find(function(err, data){
    return data;  
  })
  mongoose.disconnect();
  return table;
}

async function getArchitectureNames() {
  mongoose.connect(DB_CONNECTION, {useNewUrlParser: true, reconnectTries: 5000})
  const table = await Architecture.find({}, 'name', function(err, data){
    return data;  
  })
  mongoose.disconnect();
  return table;
}

async function getOneArchitecture(architectureName) {
  mongoose.connect(DB_CONNECTION, {useNewUrlParser: true, reconnectTries: 5000})
  const table = await Architecture.find({name: architectureName}, function(err, data){
    return data;  
  })
  mongoose.disconnect();
  return table;
}

//Create map
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

//Demo database
//   const db = require('electron-db');
//   const { app, BrowserWindow } = require("electron");
   
//   const path = require('path')
 
// // This will save the database in the same directory as the application.
// const loc = path.join(__dirname, 'data')
 
// db.createTable('customers', loc, (succ, msg) => {
//   // succ - boolean, tells if the call is successful
//   if (succ) {
//     console.log(msg)
//   } else {
//     console.log('An error has occured. ' + msg)
//   }
// })
 
function resetView() {
  map.getView().setCenter(ol.proj.fromLonLat([-100.642,39.327]));
  map.getView().setZoom(5);
}

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
    newContent.setAttribute("class", "ol-popup-content");
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
  newContent.setAttribute("class", "ol-popup-content");
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
  map.getView().setCenter(ol.proj.fromLonLat([data[0].lon, data[0].lat]))
  map.getView().setZoom(7);
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

async function openArchitectureWindow(architectureName) {
  ipcRenderer.send('show-architectureWindow', architectureName);
}

ipcRenderer.on('hello', function() {
  console.log("HWEKLAJL:DJAS");
})

//Testing part
map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;
  console.log(ol.proj.toLonLat(coordinate));
})




//Updater 

const version = document.getElementById('version');
    
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      version.innerText = 'Version ' + arg.version;
    });

    
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  message.innerText = 'A new update is available. Downloading now...';
  notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  restartButton.classList.remove('hidden');
  notification.classList.remove('hidden');
});

function closeNotification() {
  notification.classList.add('hidden');
}
function restartApp() {
  ipcRenderer.send('restart_app');
}