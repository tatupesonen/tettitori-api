import Ala from '../models/Ala';

module.exports.getAllAla = async () => {
    try {
        const result = await Ala.find({})
        return result
    } catch (err) {
        console.log(err)
    }
}

module.exports.create = async body => {
    if (!body) throw new Error('Missing ala information');
    try {
        const ala = Ala.create(body);
        return ala
    } catch (err) {
        console.log(err)
        return false
    }
}
