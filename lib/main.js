const {getHtml} = require('./html')
const cheerio = require('react-native-cheerio');
const constant = require('./constant');

const getList = async (page = null, prefix, url=null) => {
    const baseUrl = constant.baseUrl;
    let urlRequest = page ? `${baseUrl}/${prefix}/${page}` : `${baseUrl}/${prefix}`;
    if (url) urlRequest = url;
    const html = await getHtml(urlRequest);
    const $ = cheerio.load(html);
    const data = [];
    $('div.ml-item').each((index, item) => {
        const url = baseUrl + $(item).find('a.ml-mask').attr('href');
        const title = $(item).find('a.ml-mask').attr('title');
        const poster = $(item).find('img').attr('data-original');
        const quality = $(item).find('span.mli-quality').text();
        const rating = parseFloat($(item).find('span.mli-rating').text()) || undefined;
        const duration = parseInt($(item).find('span.mli-durasi').text()) || undefined;
        const result = {url, title, poster, quality, rating, duration};
        data.push(result)
    })
    return data.filter(d => d.url.includes('movie'));
}

const getFeaturedMovies = async (page=null) => {
    return getList(page, '21cineplex')
}

const getPopularMovies = async (page=null) => {
    return getList(page, 'film-bioskop-terpopuler')
}

const getLatestMovies = async (page=null) => {
    return getList(page, 'film-terbaru');
}

const searchMovies = async (query='') => {
    const url = `${constant.baseUrl}/s/${encodeURIComponent(query)}`;
    return getList(null, null, url);
}
// getFeaturedMovies(2).then(console.log)
// getPopularMovies().then(console.log)
// getLatestMovies().then(console.log)
// searchMovies('Iron man').then(console.log)

const Main = {
    getFeaturedMovies,
    getPopularMovies,
    getLatestMovies,
    searchMovies
}

module.exports = Main