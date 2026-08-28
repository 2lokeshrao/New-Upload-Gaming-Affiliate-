const { URL } = require('url');

let targetUrl = "https://example.com";
let clickId = "123";
let sub1 = "IN";
let sub2 = "bonuspromocode_web";

try {
  const formatted = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') ? targetUrl : `https://${targetUrl}`;
  const urlObj = new URL(formatted);
  console.log(urlObj.toString());
} catch (e) {
  console.log("Error:", e);
}
