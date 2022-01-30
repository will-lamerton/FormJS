/**
 * Setup Jest to work with the DOM, not Node.
 * @type {Object}
 */
const config = {
    testEnvironment: 'jsdom',
};

module.exports = config;
