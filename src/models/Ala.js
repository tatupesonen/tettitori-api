import mongoose from 'mongoose'

const alaSchema = new mongoose.Schema({
    label: {type: String, required: true },
    webaddress: {type: String, required: true},                        
})

module.exports = mongoose.model('Ala', alaSchema)

