import Tettipaikka from '../models/Tettipaikka'

module.exports.getSinglePaikka = async query => {
    //Build regexp search
    const searchKey = new RegExp(query, 'i')

    const result = await Tettipaikka.findOne({ title: searchKey })
    return result
}

module.exports.getAllPaikka = async () => {
    const result = await Tettipaikka.find({})
    return result
}

module.exports.create = async notice => {
    if (!notice) throw new Error('Missing notice information')

    const tettipaikka = new Tettipaikka(notice)

    await tettipaikka.save()
}

module.exports.delete = async id => {
    return Tettipaikka.deleteOne({ _id: id })
}
