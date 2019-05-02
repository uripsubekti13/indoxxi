const {getHtml} = require('./html');
const cheerio = require('react-native-cheerio');
const File = require('./file');

const getDetail = async (url) => {
    const html = await getHtml(url);
    const $ = cheerio.load(html);
    const data = {};
    const sources = await File.getSources(url);
    data['sources'] = sources;
    const subtitles = await File.getSubs(url);
    data['subtitles'] = subtitles;
    const cover = $('div[id=mv-ply]').attr('style').replace('background-image:url(', '').split(')')[0];
    data['cover'] = cover;
    $('div.mvi-content').each((i, info) => {
        data['title'] = $(info).find('h3[itemprop=name]').attr('content');
        data['description'] = $(info).find('div[itemprop=description] > span').text();
        $(info).find('div.mvic-info > div.mvici-left > p').each((i, left) => {
            const infoLeft = $(left).text();
            const key = infoLeft.split(': ')[0].replace(' ', '_').toLowerCase();
            const value = infoLeft.split(': ')[1];
            data[key] = value;
        })
        $(info).find('div.mvic-info > div.mvici-right > p').each((i, right) => {
            const infoRight = $(right).text();
            let separator = ': ';
            if (!infoRight.includes('Quality')) {
                const key = infoRight.split(': ')[0].replace(' ', '_').toLowerCase();
                const value = infoRight.split(': ')[1];
                data[key] = value;
            } else {
                const key = infoRight.split(':')[0].toLowerCase();
                const value = infoRight.split(':')[1].split(' ')[1];
                data[key] = value;
            }
        })
    })
    return data;
}


// getDetail(`https://indoxxi.cx/movie/first-man-2018-7xh0`).then(console.log)

const Detail = {
    getDetail
}

module.exports = Detail;