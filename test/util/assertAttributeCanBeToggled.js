'use strict';

const { By, Key, WebDriver } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Asserts that an attribute to an element can either be toggled to a custom value, or true/false
 *
 * @param {obj} t                   - ava execution object
 * @param {string} elementSelector  - element selector string
 * @param {string} attribute          - optional assertion message
 * @param {WebDriver.Key} attribute          - optional assertion message
 */
module.exports = async function assertAttributeCanBeToggled(t, selector, attribute, key, message) {
    const element = t.context.session.findElement(By.css(selector));
    await element.sendKeys(key);
    // If `value` isn't defined, reassign to `true` and assert `false` when toggling off
    t.is(
        await element.getAttribute(attribute),
        'true',
        `${attribute} should be set to 'true' after sending ${key.toString()} to example ${selector}`
    );
    await t.context.session.findElement(By.css(selector)).sendKeys(key);
    t.is(
        await element.getAttribute(attribute),
        'false',
        `aria-pressed should be set to 'false' after sending enter to example ${selector}`
    );
};
