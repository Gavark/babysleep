/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Nav_CodeInputs */

const fr_landing_nav_code = /** @type {(inputs: Landing_Nav_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code source`)
};

const en_landing_nav_code = /** @type {(inputs: Landing_Nav_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source code`)
};

/**
* | output |
* | --- |
* | "Source code" |
*
* @param {Landing_Nav_CodeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_nav_code = /** @type {((inputs?: Landing_Nav_CodeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Nav_CodeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_nav_code(inputs)
	return en_landing_nav_code(inputs)
});