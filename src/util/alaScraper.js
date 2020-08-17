const cheerio = require('cheerio');
const axios = require('axios');
const AlaService = require('../controllers/AlaService');

const URL = "https://www.kktavastia.fi/ammattiopisto-tavastia/perustutkinnot/";

const getSite = async (url) => {
    let { data } = await axios.get(url);
    console.log(`Got data from ${url}`);    
    return data
}

const extractLinks = (body) => {
    let alat = [];
    let final = [];
    let $ = cheerio.load(body);
    let links = $(".current_page_item li > a").each((i, element) => {
        let link = $(element).attr('href');
        let label = $(element).text();
        alat.push({label, webaddress: link});
    });

    /* alat.forEach(async ala => {
        let data = await getSite(ala.link);
        let $ = cheerio.load(data);
        let eperustelinkki = $('a[href^="https://eperusteet"]').attr('href');
        console.log(eperustelinkki);
    }) */
    return alat;
}

const load = async () => {
    console.log("Ladataan aloja");
    let body = await getSite(URL);
    let alat = extractLinks(body);
    alat.forEach(a => {
        AlaService.create(a);
    });
    console.log("Alat ladattu");
}

module.exports = { load };
