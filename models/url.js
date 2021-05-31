const { Schema, model} = require('mongoose')



const shortUrlSchema =  new Schema({
    full:{
        type: String,
        require: true
    },
    short:{
        type: String,
        require:true,
    },
    click: {
        type: Number,
        require: true,
        default: 0
    }
})


module.exports = model('shortURL', shortUrlSchema)