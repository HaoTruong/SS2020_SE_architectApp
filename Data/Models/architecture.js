const mongoose = require('mongoose');

const ArchitectureSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        location: {
            type: String,
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
        }
    }, 
    {
        collection: "Architecture"
    }
)

module.exports = mongoose.model('architectures', ArchitectureSchema);