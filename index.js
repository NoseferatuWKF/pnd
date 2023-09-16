import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({headless: 'new'});

    const urlMap = new Map();
    urlMap.set('https://news.ycombinator.com', '.titleline')
    urlMap.set('https://lobste.rs', '.link')

    for (const [url, selector] of urlMap) {
        const page = await browser.newPage();
        await page.goto(url);
        const titles = await page.evaluate((selector) => {
            const t = [];
            for (const el of document.querySelectorAll(selector)) {
                t.push(`${el.children[0].textContent} - ${el.children[0].getAttribute('href')}`);
            }
            return t;
        }, selector)
        titles.forEach(t => console.log(`${t}`));
    }
 
    await browser.close();
})();
