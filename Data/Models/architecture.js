const mongoose = require('mongoose');

const ArchitectureSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            require: true
        },
        name: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true,
            default: null
        },
        state: {
            type: String,
            require: true,
            default: null
        },
        architects: {
            type:  String,
            require: true,
            default: null
        },
        lon: {
            type: Number,
            require: true
        },
        lat: {
            type:  Number,
            require: true
        },
        info: {
            type:String,
            require: false
        },
        picURL: {
            type: String, 
            require: false
        },
        dateOpened: {
            type: String,   
            require: false
        }
    },
    {
        collection: 'Architecture'
    }
)

module.exports = mongoose.model('architectures', ArchitectureSchema);