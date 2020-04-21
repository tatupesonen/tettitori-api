import Tettipaikka from '../models/Tettipaikka'
import { generatePassword } from '../util/passwordgen'

module.exports.getSinglePaikka = async query => {
    //Build regexp search
    const searchKey = new RegExp(query, 'i')

    const result = await Tettipaikka.findOne({ title: searchKey })
    return result
}

module.exports.searchPaikkaByTitle = async query => {
    //Build regexp search
    const searchKey = new RegExp(query, 'i')

    try {
        const result = await Tettipaikka.find({ title: searchKey })
        return result
    } catch (err) {
        console.log(err)
    }
}

module.exports.searchPaikkaByPassword = async query => {

    try {
        const result = await Tettipaikka.findOne({ password: query })
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
    }
}

module.exports.getAllPaikka = async () => {
    try {
        const result = await Tettipaikka.find({})
        return result
    } catch (err) {
        console.log(err)
    }
}

module.exports.create = async notice => {
    if (!notice) throw new Error('Missing notice information')
    try {
        notice.password = generatePassword()
        const tettipaikka = Tettipaikka.create(notice);
        return tettipaikka
    } catch (err) {
        console.log(err)
        return false
    }
    
}

module.exports.delete = async id => {
    try {
        return Tettipaikka.deleteOne({ _id: id })
    } catch (err) {
        console.log(err)
    }
}
