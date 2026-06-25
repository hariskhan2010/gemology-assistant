import https from "https";
const apiKey = "AIzaSyCxyzoRRb9ibCjkGNzh9NEDEopWm1tq9NA";
const body = JSON.stringify({
  model: "models/gemini-embedding-001",
  content: { parts: [{ text: "Ruby is a red gemstone" }] }
});
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
const req = https.request(url, { method: "POST", headers: { "Content-Type": "application/json" } }, (res) => {
  let data = "";
  res.on("data", c => data += c);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data.slice(0, 500));
  });
});
req.write(body);
req.end();
