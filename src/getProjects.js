const Apify = require('apify');
const request = require('request-promise-native');
const cheerio = require('cheerio');
const _ = require('lodash');
const querystring = require('querystring');
const { DNS_SAFE_NAME_REGEX } = require('apify-shared/regexs');
const parseInput = require('./parseInput');
const cleanProject = require('./cleanProject');
const { crash } = require('./utils');
const { BASE_URL, PROJECTS_PER_PAGE, MAX_PAGES } = require('./consts');

const commonHeaders = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
};

/**
 * Prepares a request with initialized cookies and stored csrf token (seed).
 * @param {*} queryParameters Query used in all subsequent requests
 * @return {Object} Returns object containing prepared instance of Request, query parameters and loaded seed.
 */
async function getPreparedRequest(queryParameters) {
    const params = querystring.stringify(queryParameters);
    const url = `${BASE_URL}${params}`;

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

/**
 *
 * @param {Number} page Page number
 * @param {Object} query Query parameters used with the page
 * @param {Number} seed CSRF token loaded from kickstarter
 * @param {Request} preparedRequest Instance of Request class with prepared cookies
 * @return {Object} Loaded page data from the website
 */
function getDataForPage(page, query, seed, preparedRequest) {
    console.log(`Page ${page}: Loading projects`);
    const params = querystring.stringify({
        ...query,
        page,
        seed,
    });
    const url = `${BASE_URL}${params}`;
    return preparedRequest({
        url,
        headers: { ...commonHeaders },
        json: true,
    });
}

/**
 * Kickstarter has limit of 200 pages (2400 projects) for a search
 * this functions outputs explanation of this to console.
 * @param {Number} foundProjects How many projects were found
 * @param {Number} limit How many projects does kickstarter allow
 * @return {Void}
 */
function notifyAboutMaxResults(foundProjects, limit) {
    console.log('|');
    console.log(`| Found ${foundProjects} projects which is more than the maximum`);
    console.log(`| allowed number of projects (${limit}) not all projects`);
    console.log('| will be outputed');
    console.log('|');
}

/**
 * Output's to console estimated time when the actor will finish.
 * @param {Number} currentPage Page that was loaded
 * @param {Number} startedAt Unix timestamp of when actor started
 * @param {Number} savedProjects Number of saved projects
 * @param {Number} totalProjects Number of remaning projects
 * @return {Void}
 */
function notifyAboutEstimatedTime(currentPage, startedAt, savedProjects, totalProjects) {
    const elapsedTime = Date.now() - startedAt;
    const timeSpentPerResult = elapsedTime / savedProjects;
    const remainingTime = timeSpentPerResult * (totalProjects - savedProjects);
    const estimatedFinish = new Date(Date.now() + remainingTime);
    console.log(`Page ${currentPage}: Estimated finish at ${estimatedFinish}`);
}

/**
 * Takes input provided by the user, prepares a request with cookie jar and
 * parsed csrf token and then queries kickstarter with it, it continues loading data
 * from kickstarter until it hits maxResults count of projects or 2400 (default kickstarter limit).
 * All data is saved to dataset.
 * @param {Object} input Input loaded from KV store
 */
async function getProjects(input) {
    const queryParameters = await parseInput(input);
    const { datasetName } = input;
    let { maxResults } = input;
    if (maxResults && (!_.isNumber(maxResults) || maxResults <= 0)) crash('Input parameter maxResults must be a positive number');
    else if (!maxResults) maxResults = 200 * PROJECTS_PER_PAGE;

    if (datasetName && !DNS_SAFE_NAME_REGEX.test(datasetName)) {
        crash('Input parameter datasetName can only contain alphabet characters, numbers and dash (e.g. "my-dataset-name")');
    }

    console.log('Loading projects for query:');
    console.log(queryParameters);

    const { preparedRequest, seededQueryParameters } = await getPreparedRequest(queryParameters);

    let hasMoreResults = false;
    let page = 1;
    let { seed } = seededQueryParameters;
    let totalProjects = 0;
    let savedProjects = 0;
    const startedAt = Date.now();
    const maximumResults = Math.min(maxResults, MAX_PAGES * PROJECTS_PER_PAGE);

    let dataset = null;
    if (datasetName) {
        dataset = await Apify.client.datasets.getOrCreateDataset({ datasetName });
        await Apify.client.datasets.deleteDataset({ datasetId: dataset.id });
        dataset = await Apify.client.datasets.getOrCreateDataset({ datasetName });
        dataset = await Apify.openDataset(dataset.id);
    }

    do {
        const data = await getDataForPage(page, queryParameters, seed, preparedRequest);

        if (page === 1) {
            console.log(`Page ${page}: Found ${data.total_hits} projects`);
            // If kickstarter contains more then 2400 results for current query, notify user
            // that he will not have all results and that he needs to refine his query.
            if (data.total_hits > maximumResults) notifyAboutMaxResults(data.total_hits, maximumResults);
            totalProjects = Math.min(data.total_hits, maximumResults);
        }

        const projectsToSave = data.projects.slice(0, maximumResults - savedProjects).map(cleanProject);
        seed = data.seed; // eslint-disable-line
        await Apify.pushData(projectsToSave);
        if (dataset) await dataset.pushData(projectsToSave);
        console.log(`Page ${page}: Saved ${projectsToSave.length} projects`);

        savedProjects += projectsToSave.length;
        hasMoreResults = data.has_more;

        if (hasMoreResults) {
            const finished = 1 - (savedProjects / totalProjects);
            const remainingProjectsPercentage = Math.round(finished * 10000) / 100;
            console.log(`Page ${page}: Remaining projects ${totalProjects - savedProjects} (${100 - remainingProjectsPercentage}% finished)`);

            // Every 10 pages output estimated time of finish
            if (page % 10 === 0) notifyAboutEstimatedTime(page, startedAt, savedProjects, totalProjects);
        }
        page++;
    } while (hasMoreResults && savedProjects < totalProjects);

    console.log('All projects saved');
}

module.exports = getProjects;
