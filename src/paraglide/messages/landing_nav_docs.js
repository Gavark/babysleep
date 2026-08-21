/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Nav_DocsInputs */

const fr_landing_nav_docs = /** @type {(inputs: Landing_Nav_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documentation`)
};

const en_landing_nav_docs = /** @type {(inputs: Landing_Nav_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documentation`)
};

/**
* | output |
* | --- |
* | "Documentation" |
*
* @param {Landing_Nav_DocsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_nav_docs = /** @type {((inputs?: Landing_Nav_DocsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Nav_DocsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_nav_docs(inputs)
	return en_landing_nav_docs(inputs)
});