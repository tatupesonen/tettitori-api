import mongoose from 'mongoose'

const tettipaikkaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: String,
    tyontekijalkm: Number,
    tehtavat: { type: String, required: true },
    yhteydenottotapa: { type: String, required: true },
    additionalInfo: String,
    contactPerson: String,
    URL: String,
    imgURL: String,
    ala: [{
      type: String
    }],
    password: { type: String, required: true, select: false }
})

module.exports = mongoose.model('Tettipaikka', tettipaikkaSchema)

//Fields
/*
  - Otsikko (Samalla nimi)
  - Osoite
  - Työntekijä lkm
  - Työtehtävät (vapaamuotoinen kuvaus)
  - Yhteydenottotapa
  - "Muuta"-osio
  - TET-yhteyshenkilön tiedot
  - Mahd. verkkosivujen osoite
 */
