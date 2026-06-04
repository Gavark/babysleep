/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_AccountInputs */

const fr_app_nav_account = /** @type {(inputs: App_Nav_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte`)
};

const en_app_nav_account = /** @type {(inputs: App_Nav_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account`)
};

/**
* | output |
* | --- |
* | "Account" |
*
* @param {App_Nav_AccountInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_account = /** @type {((inputs?: App_Nav_AccountInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_AccountInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_account(inputs)
	return en_app_nav_account(inputs)
});