import tettipaikkaModel from '../models/Tettipaikka'

module.exports.getSinglePaikka = async query => {
    //Build regexp search
    const searchKey = new RegExp(query, 'i')

    const result = await tettipaikkaModel.findOne({ title: searchKey })
    console.log(result)
    return result
}

module.exports.getAllPaikka = async () => {
    const result = await tettipaikkaModel.find({})
    return result
}

module.exports.create = async notice => {
    if (!notice) throw new Error('Missing notice information')

    await tettipaikkaModel.create(notice)
}
