const puppeteer = require('puppeteer');
const axios = require("axios");
const fs = require("fs");
var cheerio = require("cheerio");
const util = require("util");
var url = require("url");
var devRant = require("rantscript");
const save = util.promisify(fs.writeFile);
var imgur = require("imgur");

async function load(url) {  
  const writer = fs.createWriteStream("meme.jpg")
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })
  response.data.pipe(writer)
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

(async function() {
  var browser = await puppeteer.launch({args: ['--no-sandbox']});
  var page = await browser.newPage();
  try {
  var url;
  /*while (true) {
  await page.goto("https://9gag.com/shuffle");
  var isvideo = await page.evaluate(function() {
     return document.querySelector("video source")?true:false;
  });
  url = await page.evaluate(function() {
     return document.querySelector("link[rel='image_src']").href;
  });
  if (!isvideo) break;
  }
  console.log(url);*/
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Mobile Safari/537.36');
  
  //await load(url);
  await page.setViewport({width: 330, height: 530});
  await page.goto("https://ifunny.co/",{waitUntil: 'networkidle0'});

 const [fileChooser] = await Promise.all([
  page.waitForFileChooser(),
  page.click("div[data-testid='new-post-button']")
]);

await fileChooser.accept(['meme.jpg']);

await page.waitFor(1000);

await page.evaluate(function() {
  document.querySelectorAll("button")[1].click();
});

await page.waitFor(500);
    
  await page.screenshot({path: 'ss.png'});
  var link = (await imgur.uploadFile('ss.png')).data.link;
  console.log(link);
  }
  catch (e) {
  console.log(e.message);
  await page.screenshot({path: 'ss.png'});
  var link = (await imgur.uploadFile('ss.png')).data.link;
  console.log(link);
  }
  await browser.close();
})();
