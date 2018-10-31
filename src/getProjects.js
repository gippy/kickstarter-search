const Apify = require('apify');
const request = require('request-promise-native');
const querystring = require('querystring');
const parseInput = require('./parseInput');
const { BASE_URL } = require('./consts');
const cheerio = require('cheerio');

const commonHeaders = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
};

async function getPreparedRequest(queryParameters) {
    const params = querystring.stringify(queryParameters);
    const url = `${BASE_URL}${params}`;


    const sessionLength = 8;
    const proxy = Apify.getApifyProxyUrl({
        session: `ks${Math.floor(Math.random() * (10 ** sessionLength)).toString().padStart(sessionLength, '0')}`,
    });

    // Prepare cookie jar so that the second request contains cookies from the first one
    const cookieJar = request.jar()
    const preparedRequest = request.defaults({ jar: cookieJar, proxy })

    // Query the url and load csrf token from it
    const html = await preparedRequest({
        url,
        headers: { ...commonHeaders },
    });

    const $ = cheerio.load(html);
    const seed = $('.js-project-group[data-seed]').attr('data-seed');

    return {
        preparedRequest,
        seededQueryParameters: {
            ...queryParameters,
            seed,
        },
    };
}

async function getProjects(input) {
    const queryParameters = await parseInput(input);
    const { preparedRequest, seededQueryParameters } = await getPreparedRequest(queryParameters);

    console.log(seededQueryParameters);

    let hasMoreResults = false;
    let page = 1;
    let { seed } = seededQueryParameters;
    do {
        console.log(`Page ${page}: Loading projects`);
        const params = querystring.stringify({
            ...queryParameters,
            page,
            seed,
        });
        const url = `${BASE_URL}${params}`;
        const data = await preparedRequest({
            url,
            headers: { ...commonHeaders },
            json: true,
        });
        if (page === 1) {
            console.log(`Page ${page}: Found ${data.total_hits} projects`);
        }
        console.log(`Page ${page}: Saving ${data.projects.length} projects`);
        hasMoreResults = data.has_more;
        seed = data.seed; // eslint-disable-line
        await Apify.pushData(data.projects);
        page++;
    } while (hasMoreResults);

    console.log('All projects saved');
}

module.exports = getProjects;
