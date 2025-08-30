const axios = require("axios");
const cheerio = require("cheerio");
const { chromium } = require("playwright");
//  Layer 1 Scrapping
async function scrapeWithCheerio(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    const $ = cheerio.load(data);

    const title = $("title").text();
    let content = "";
    $("article, .article, .post, #content, #main")
      .find("p")
      .each((_idx, el) => {
        content += $(el).text() + "\n";
      });

    // If no content found with specific selectors, fall back to all p tags
    if (content.length < 200) {
      content = "";
      $("p").each((_idx, el) => {
        content += $(el).text() + "\n";
      });
    }

    return { title: title.trim(), content: content.trim() };
  } catch (error) {
    console.log(`Cheerio scraping failed: ${error.message}`);
    return null;
  }
}

// Layer 2 Scrapping for dynamic content
async function scrapeWithPlaywright(url) {
  let browser = null;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" }); // Wait for page to load

    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $("title").text();
    let content = "";
    $("p").each((_idx, el) => {
      content += $(el).text() + "\n";
    });

    return { title: title.trim(), content: content.trim() };
  } catch (error) {
    console.log(`Playwright scraping failed: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// The main function for scraping
async function scrapeArticle(url) {
  let article = await scrapeWithCheerio(url);

  // If Layer 1 fails or returns very little content, try Layer 2
  if (!article || article.content.length < 200) {
    article = await scrapeWithPlaywright(url);
  }
  return article;
}

module.exports = { scrapeArticle };
