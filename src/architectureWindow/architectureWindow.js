const ipcRenderer = require('electron').ipcRenderer;
const mongoose = require('mongoose');
const Architecture = require('../../Data/Models/architecture');
require('dotenv/config');
const DB_CONNECTION = "mongodb+srv://HT-Admin:Haotruong2@cluster0.fiqy6.mongodb.net/GeoArchitect?retryWrites=true&w=majority";

async function getOneArchitecture(architectureName) {
    mongoose.connect(DB_CONNECTION, {useNewUrlParser: true, reconnectTries: 5000})
    const table = await Architecture.find({name: architectureName}, function(err, data){
      return data;  
    })
    mongoose.disconnect();
    return table;
}


function getInfo() {
    ipcRenderer.on('send-architectureName', async function(e, arg) {
        var data = await getOneArchitecture(arg);

        document.getElementsByClassName('architectName')[0].innerHTML = data[0].name;
        document.getElementsByClassName('Location')[0].innerHTML = data[0].city;
        document.getElementsByClassName('Author')[0].innerHTML = data[0].architects;
        if (data[0].dateOpened){
            document.getElementsByClassName('Date')[0].innerHTML = data[0].dateOpened;
        }
        if (data[0].info) {
            document.getElementsByClassName('Information')[0].innerHTML = data[0].info;
        }
        if (data[0].picURL) {
            //document.getElementsByClassName('architectImage')[0].innerHTML = "<img src=\"../../assets/img/"+data[0].picURL+".jpg\">";
            var space = document.getElementsByClassName('col-lg col-md');
            image = document.createElement('img');
            image.setAttribute('class',"architectureImage");
            image.src = "../../assets/img/"+data[0].picURL+".jpg";
            space[1].appendChild(image);
        }
    })
    
}


