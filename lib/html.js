const fetch = require('node-fetch');

const getHtml = async (url) => {
    return (await fetch(url)).text()
}

module.exports = {
    getHtml
}