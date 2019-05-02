const { getHtmlAndCookie } = require("./html");

const getStreamFiles = async driveid => {
  const url = `https://drive.google.com/file/d/${driveid}/view`;
  const { html, cookie } = await getHtmlAndCookie(url);

  const stringList = html
    .split('["fmt_list","')[1]
    .split('"]')[0]
    .split(",");
  const list = stringList.map(sL => {
    const code = sL.split("/")[0];
    const label = sL.split("/")[1].split("x")[1] + "p";
    return {
      code,
      label
    };
  });
  const stringStream = html
    .split(`["fmt_stream_map","`)[1]
    .split(`"]`)[0]
    .split(",");
  const sources = stringStream.map(s => {
    const code = s.split("|")[0];
    const file = s
      .split("|")[1]
      .replace(/u003d/g, "=")
      .replace(/u0026/g, "&")
      .split("")
      .filter(x => x != `\\`)
      .join("");
    const label = list.find(l => l.code === code).label;
    return { label, file };
  });
  return { cookie, sources };
};
// getStreamFiles('1638C_PboljAsrXOQ68fva7sp5Kf-28D-').then(console.log)
// .then(console.log)

module.exports = { getStreamFiles };
