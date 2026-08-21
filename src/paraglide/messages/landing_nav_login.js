/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Nav_LoginInputs */

const fr_landing_nav_login = /** @type {(inputs: Landing_Nav_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se connecter`)
};

const en_landing_nav_login = /** @type {(inputs: Landing_Nav_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in`)
};

/**
* | output |
* | --- |
* | "Sign in" |
*
* @param {Landing_Nav_LoginInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_nav_login = /** @type {((inputs?: Landing_Nav_LoginInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Nav_LoginInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_nav_login(inputs)
	return en_landing_nav_login(inputs)
});