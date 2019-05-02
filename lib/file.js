const { getHtml } = require('./html');

const getGSharer = async url => {
    const html = await getHtml(url.includes('play') ? url : `${url}/play`);
    const GSharer = parseInt(html.split(`data-tmdb="`)[1].split(`"`)[0]);
    return GSharer;
};

const getHtmlSource = async url => {
    const urlEncoded = encodeURIComponent(url);
    const GSharer = await getGSharer(url);
    let urlRequest = `https://a.akubebas.com/gsharer/?gsharer=${GSharer}&gshareruri=${urlEncoded}&gsharertitle=SubektiUnyu`;
    let html = await getHtml(urlRequest);
    return html;
};

const getSources = async url => {
    let html = await getHtmlSource(url);
    if (html.includes('expired')) {
        let newUrl = null;
        if (url.includes('play')) {
            newUrl = url.replace('/play', '');
        } else {
            newUrl = url + '/play';
        }
        html = await getHtmlSource(newUrl);
    }
    if (html.includes('expired')) return [];
    const stringSources = html.split(`localStorage.gsharerfile = '`)[1].split(`'`)[0];
    const sources = JSON.parse(stringSources);
    return sources.map( s => {
        let files = s.sources;
        const type = s.meta.type;
        let driveid = undefined;
        if (type === 'drives_muvi' || type === 'drives_lk21' || type.includes('drives_')) {
            const fileUrl = files[0].file;
            if (fileUrl.includes('driveid')) {
                driveid = fileUrl.split('driveid=')[1].split('&')[0];
                files = undefined;
            }
        }
        
        return { type, driveid, files };
    });
};

const getSubs = async (url, urlReq = null) => {
    const baseUrl = `https://sub.akubebas.com`;
    const GSharer = urlReq ? null : await getGSharer(url);
    const urlRequest = urlReq || `${baseUrl}/muvi/${GSharer}/`;
    const html = await getHtml(urlRequest);
    const splitted = html.split(`A HREF="`).filter((a, i) => i !== 0 && i !== 1);
    const links = html
        .split(`A HREF="`)
        .filter((a, i) => i !== 0 && i !== 1)
        .map(a => a.split(`">`)[0]);
    let linkFiles = links.filter(l => l.includes('.srt')).map(u => baseUrl + u);
    const linkFolders = links.filter(l => l.split('').reverse()[0] === '/');
    for (let i = 0; i < linkFolders.length; i++) {
        const url = `${baseUrl}${linkFolders[i]}`;
        const files = await getSubs(null, url);
        linkFiles = linkFiles.concat(files);
    }
    return linkFiles;
};

// const url = `https://indoxxi.cx/movie/first-man-2018-7xh0`;
// getSources(url)
// .then(console.log).catch(console.log)

// getSubs('https://indoxxi.cx/movie/hellboy-2019-9sf8').then(console.log)

module.exports = {
    getSources,
    getSubs
};
