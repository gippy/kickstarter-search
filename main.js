const Apify = require('apify');
const request = require('request-promise');
const cheerio = require('cheerio');

/**
 * Helper function which writes provided message into console log and then
 * exists the process with failure code.
 * 
 * @param {String} errorMessage Message to be written into console log
 */
function crash(errorMessage) {
    console.log(errorMessage);
    process.exit(1);
}

Apify.main(async () => {
    // Load query from input
    const input = await Apify.getValue('INPUT');
    if (!input) crash('Key-value store does not contain INPUT.');

    // TODO: Code here
});
