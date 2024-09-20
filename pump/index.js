import puppeteer from 'puppeteer';

function matchArgs() {
    const urlMap = new Map();

    // TODO: create a Monad for this
    function buildURL(url, urlVal) {
        if (url !== '--url') {
            return null;
        }
        return function(selector, selectorVal) {
            if (selector !== '--selector') {
                return null;
            }
            return function(pages, pagesVal) {
                if (pages !== '--pages') {
                    return null;
                }
                pagesVal = !!parseInt(pagesVal) ? parseInt(pagesVal) : 1;
                for (let i = 1; i < pagesVal + 1; i++) {
                    urlMap.set(urlVal + i, selectorVal);
                }
                return null;
            }
        }
    }

    let builder = buildURL;

    process.argv.find((a, i) => {
        if (!builder) {
            builder = buildURL;
        }

        switch (a) {
            case '--url':
            case '--selector':
            case '--pages':
                if (!process.argv[i + 1]) {
                    return;
                }
                builder = builder(a, process.argv[i + 1]);
            break;
        }
    })

    return urlMap;
}

(async () => {
    const urlMap = matchArgs();

    const browser = await puppeteer.launch({headless: 'shell', args: ['--no-sandbox']});

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

        titles.forEach(t => console.log(t));
    }

    await browser.close();
})();
