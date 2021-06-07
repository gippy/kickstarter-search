const Apify = require('apify');
const querystring = require('querystring');

const { utils: { log, requestAsBrowser } } = Apify;

const { cleanProject, getToken, notifyAboutMaxResults } = require('./utils');
const { BASE_URL, MAX_PAGES, PROJECTS_PER_PAGE } = require('./consts');

exports.handleStart = async ({ request, session }, query, requestQueue, proxyConfig, maxResults) => {
    // on this phase - getting TOKEN AND COOKIES
    const { seed, cookies } = await getToken(request.url, session, proxyConfig);

    const page = 1;
    const totalProjects = 0;
    const savedProjects = 0;
    const maximumResults = Math.min(maxResults, MAX_PAGES * PROJECTS_PER_PAGE);

    const params = querystring.stringify({
        ...query,
        page,
        seed,
    });
    const listUrl = `${BASE_URL}${params}`;

    // ADDING TO THE QUEUE FIRST PAGINATION PAGE WITH JSON
    await requestQueue.addRequest({
        url: listUrl,
        userData: {
            cookies,
            page,
            label: 'PAGINATION-LIST',
            totalProjects,
            savedProjects,
            maximumResults,
        },
    });
};

exports.handlePagination = async ({ request, session }, requestQueue, proxyConfiguration) => {
    let { page, totalProjects, savedProjects } = request.userData;
    const { cookies, maximumResults } = request.userData;

    // MAKING REQUEST => JSON OBJECT IN RESPONSE
    const { body } = await requestAsBrowser({
        url: request.url,
        proxyUrl: proxyConfiguration.newUrl(session.id),
        headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            Cookie: cookies,
        },
        json: true,
    });

    // ON THE FIRST PAGE WE ARE CHECKING IF WE REACHED THE LIMIT
    if (page === 1) {
        log.info(`Page ${page}: Found ${body.total_hits} projects in total.`);
        // If kickstarter contains more then 2400 results for current query, notify user
        // that he will not have all results and that he needs to refine his query.
        if (body.total_hits > maximumResults) notifyAboutMaxResults(body.total_hits, maximumResults);
        totalProjects = Math.min(body.total_hits, maximumResults);
    }
    // ARRAY OF THE PROJECTS FROM THE PAGE
    log.info(`Number of  saved projects: ${savedProjects}`);
    let projectsToSave
    try {
        projectsToSave = body.projects.slice(0, maximumResults - savedProjects)
        .map(cleanProject);    
    } catch (e) {
        new Error('The page didn\'t load as expected, Will retry...')
    }
    
    // GETTING NEW SEED (TOKEN) FROM JSON
    const { seed } = body;
    // SAVING NEEDED NUMBER OF ITEMS
    if (projectsToSave.length > 0) {
        await Apify.pushData(projectsToSave);
        log.info(`Page ${page}: Saved ${projectsToSave.length} projects.`);
        savedProjects += projectsToSave.length;
    }
    // FLAG FROM JSON
    const hasMoreResults = body.has_more;
    if (hasMoreResults && savedProjects < totalProjects) {
        page++;
        // UPDATING IN THE CURRENT LINK PAGE NUMBER AND SEED AND ADDING IT TO THE QUEUE
        const nextPage = request.url.replace(request.url.match(/page=([0-9.]+)/)[0], `page=${page}`)
            .replace(request.url.match(/seed=([0-9.]+)/)[0], `seed=${seed}`);
        // ADDING TO THE QUEUE
        await requestQueue.addRequest({
            url: nextPage,
            userData: {
                label: 'PAGINATION-LIST',
                page,
                savedProjects,
                maximumResults,
                totalProjects,
            },
        });
    }
};
