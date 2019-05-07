const fetch = require("node-fetch");
const login = `871604efd9d5c9d6`;
const key = `7hPtnbnH`;

const getTicket = async fileId => {
  const response = await (await fetch(
    `https://api.openload.co/1/file/dlticket?file=${fileId}&login=${login}&key=${key}`
  )).json();
  if (response && response.result && response.result.ticket) {
    return response.result.ticket;
  } else {
    return null;
  }
};

const getFile = async (fileId) => {
    const ticket = await getTicket(fileId);
    if (!ticket) throw new Error('File not found');
    const response = await (await fetch(`https://api.openload.co/1/file/dl?file=${fileId}&ticket=${ticket}`)).json();
    if (response && response.result && response.result.url) {
        const label = response.result.name;
        const file = response.result.url;
        return {label, file}
    }
    return null
}
getFile(`jep8VzB5JxE`).then(console.log);
