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

module.exports = {
    crash,
}
