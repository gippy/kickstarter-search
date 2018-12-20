
const Apify = require('apify');
const _ = require('lodash');
const { ACT_JOB_STATUSES } = require('apify-shared/consts');
const { crash } = require('./utils');
const { EMPTY_SELECT, LOCATION_SEARCH_ACTOR_ID, DEFAULT_SORT_ORDER } = require('./consts');
const { statuses, categories, pledges, goals, raised, sorts } = require('./filters');

async function processLocation(location) {
    if (_.isFinite(Number(location))) return location;
    if (!_.isString(location)) crash(`Input parameter location contains invalid value ${location}`);

    const user = await Apify.client.users.getUser();
    if (user.proxy.groups.length < 1) crash('You do not have access to Apify proxy, sadly this means, that location cannot be found. Refer to readme of this actor to see how to remedy this situation.');

    console.log(`Quering kickstarter for location ID of "${location}"`);
    const run = await Apify.call(
        LOCATION_SEARCH_ACTOR_ID,
        { query: location },
    );
    if (run.status !== ACT_JOB_STATUSES.SUCCEEDED) crash(`Actor ${LOCATION_SEARCH_ACTOR_ID} did not finish correctly.`);
    const { locations } = run.output.body;
    if (!locations.length) crash(`Location "${location}" was not found.`);
    console.log(`Location found, woe_id is - ${locations[0].id}`);
    return locations[0].id;
}

async function parseInput(input) {
    if (!input) crash('Key-value store does not contain INPUT.');
    const queryParams = {};

    // Filter out empty filter values
    const filledInFilters = {};
    Object.keys(input).forEach((key) => {
        const filterValue = _.isString(input[key]) ? input[key].trim() : input[key];
        if (!filterValue || filterValue === EMPTY_SELECT) return;
        filledInFilters[key] = filterValue;
    });

    // process search term
    if (filledInFilters.query) queryParams.term = filledInFilters.query;

    // process category
    if (filledInFilters.category) {
        const fromInputLowerCase = filledInFilters.category.toLowerCase();
        const foundCategories = categories.filter((category) => {
            return fromInputLowerCase.category === category.id || fromInputLowerCase === category.slug.toLowerCase();
        });
        if (!foundCategories.length) crash(`Input parameter category contains invalid value "${filledInFilters.category}"`);
        queryParams.category_id = foundCategories[0].id;
    }

    // process status
    if (filledInFilters.status) {
        const state = statuses[filledInFilters.status];
        if (!state) crash(`Input parameter status contains invalid value "${filledInFilters.state}"`);
        queryParams.state = state;
    }

    // process pledged
    if (filledInFilters.pledged) {
        const pledged = pledges.indexOf(filledInFilters.pledged.toLowerCase());
        if (pledged === -1) crash(`Input parameter pledged contains invalid value "${filledInFilters.pledged}"`);
        queryParams.pledged = pledged;
    }

    // process goal
    if (filledInFilters.goal) {
        const goal = goals.indexOf(filledInFilters.goal.toLowerCase());
        if (goal === -1) crash(`Input parameter goal contains invalid value "${filledInFilters.goal}"`);
        queryParams.goal = goal;
    }

    // process raised
    if (filledInFilters.raised) {
        const amountRaised = raised.indexOf(filledInFilters.raised.toLowerCase());
        if (amountRaised === -1) crash(`Input parameter raised contains invalid value "${filledInFilters.raised}"`);
        queryParams.raised = amountRaised;
    }

    // process raised
    if (filledInFilters.sort) {
        const sort = sorts.indexOf(filledInFilters.sort.toLowerCase());
        if (sort === -1) crash(`Input parameter sort contains invalid value "${filledInFilters.sort}"`);
        queryParams.sort = sort;
    } else {
        queryParams.sort = DEFAULT_SORT_ORDER;
    }

    if (filledInFilters.location) queryParams.woe_id = await processLocation(filledInFilters.location);

    queryParams.page = 1;

    // ?state=live&term=test&category_id=10&woe_id=796597&pledged=1&goal=2&raised=1&sort=newest&seed=2568330&page=1

    return queryParams;
}

module.exports = parseInput;
