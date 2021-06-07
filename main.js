const Apify = require('apify');
const querystring = require('querystring');

const { parseInput } = require('./src/utils');
const { BASE_URL, PROJECTS_PER_PAGE } = require('./src/consts');
const { handleStart, handlePagination } = require('./src/routes');

const { log } = Apify.utils;

Apify.main(async () => {
    const proxyConfiguration = await Apify.createProxyConfiguration();
    const requestQueue = await Apify.openRequestQueue();
    const input = await Apify.getInput();
    // GETTING PARAMS FROM THE INPUT
    const queryParameters = await parseInput(input);
    let { maxResults } = input;
    if (!maxResults) maxResults = 200 * PROJECTS_PER_PAGE;
    const params = querystring.stringify(queryParameters);
    const firstUrl = `${BASE_URL}${params}`;
    // ADDING TO THE QUEUE FIRST PAGE TO GET TOKEN
    await requestQueue.addRequest({
        url: firstUrl,
        userData: {
            page: 1,
            label: 'START',
            searchResults: [],
            itemsToSave: [],
            savedItems: 0,
            maxResults,
        },
    });
    // CRAWLER
    const crawler = new Apify.BasicCrawler({
        requestQueue,
        maxConcurrency: 1,
        useSessionPool: true,
        maxRequestRetries: 5,
        handleRequestFunction: async (context) => {
            const { url, userData: { label } } = context.request;
            log.info('Page opened.', { label, url });
            // eslint-disable-next-line default-case
            switch (label) {
                case 'START':
                    return handleStart(context, queryParameters, requestQueue, proxyConfiguration, maxResults);
                case 'PAGINATION-LIST':
                    return handlePagination(context, requestQueue, proxyConfiguration);
            }
        },
        handleFailedRequestFunction: async ({
            request,
            error,
        }) => {
            log.error(`Request ${request.url} failed repeatedly, running out of retries (Error: ${error.message})`);
        },
    });
    log.info('Starting crawler');
    await crawler.run();
    log.info('Crawler finished');
});
