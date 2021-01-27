const mongoose = require('mongoose')
const Scheme = mongoose.Schema


const leaderSchema = new Scheme({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    abbr:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    featured:{
        type: Boolean,
        default: false
    }
})

let Leader = mongoose.model('Leader', leaderSchema)

module.exports = Leader
