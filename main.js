const Apify = require('apify');
const getProjects = require('./src/getProjects');

Apify.main(async () => {
    // Load query from input
    const input = await Apify.getValue('INPUT');
    await getProjects(input);
});
