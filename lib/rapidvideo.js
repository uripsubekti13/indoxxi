const { getHtml } = require("./html");
const cheerio = require("cheerio");

const getStreamFiles = async url => {
  const html = await getHtml(url);
  const $ = cheerio.load(html);
  const file = $("video[id=videojs]")
    .find("source")
    .attr("src");
  const label = $("video[id=videojs]")
    .find("source")
    .attr("title");
  return { file, label };
};

getStreamFiles("https://rapidvideo.com/e/G2R6BS500V").then(console.log);

module.exports = { getStreamFiles };
