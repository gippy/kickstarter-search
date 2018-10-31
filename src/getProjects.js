const Apify = require('apify');
const request = require('request-promise-native');
const cheerio = require('cheerio');
const querystring = require('querystring');
const parseInput = require('./parseInput');
const { BASE_URL } = require('./consts');

const commonHeaders = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
};

async function getPreparedRequest(queryParameters) {
    const params = querystring.stringify(queryParameters);
    const url = `${BASE_URL}${params}`;


    /*
    const sessionLength = 8;
    const proxy = Apify.getApifyProxyUrl({
        session: `ks${Math.floor(Math.random() * (10 ** sessionLength)).toString().padStart(sessionLength, '0')}`,
    });
    */

    // Prepare cookie jar so that the second request contains cookies from the first one
    const cookieJar = request.jar();
    const preparedRequest = request.defaults({ jar: cookieJar /* proxy */ });

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
    console.log('Loading projects for query');
    console.log(queryParameters);

    const { preparedRequest, seededQueryParameters } = await getPreparedRequest(queryParameters);

    let hasMoreResults = false;
    let page = 1;
    let { seed } = seededQueryParameters;
    let totalProjects = 0;
    let savedProjects = 0;
    const startedAt = Date.now();
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
            totalProjects = data.total_hits;
        }
        seed = data.seed; // eslint-disable-line
        await Apify.pushData(data.projects);
        console.log(`Page ${page}: Saved ${data.projects.length} projects`);

        savedProjects += data.projects.length;
        hasMoreResults = data.has_more;
        if (hasMoreResults) {
            const finished = 1 - (savedProjects / totalProjects);
            const remainingProjectsPercentage = Math.round(finished * 10000) / 100;
            console.log(`Page ${page}: Remaining projects ${totalProjects - savedProjects} (${remainingProjectsPercentage}%)`);

            if (page % 10 === 1) {
                const elapsedTime = Date.now() - startedAt;
                const timeSpentPerResult = elapsedTime / savedProjects;
                const remainingTime = timeSpentPerResult * (totalProjects - savedProjects);
                const estimatedFinish = new Date(Date.now() + remainingTime);
                console.log(`Page ${page}: Estimated finish at ${estimatedFinish}`);
            }
        }
        page++;
    } while (hasMoreResults);

    console.log('All projects saved');
}

module.exports = getProjects;
