const https = require("https");
const apiKey = "AIzaSyCxyzoRRb9ibCjkGNzh9NEDEopWm1tq9NA";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
https.get(url, (res) => {
  let data = "";
  res.on("data", c => data += c);
  res.on("end", () => {
    const models = JSON.parse(data).models || [];
    models.filter(m => m.name.includes("embed")).forEach(m => console.log(m.name, m.supportedGenerationMethods?.join(", ") || ""));
  });
}).on("error", e => console.error(e.message));
