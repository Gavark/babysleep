/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Privacy_4Inputs */

const fr_landing_privacy_4 = /** @type {(inputs: Landing_Privacy_4Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export CSV à tout moment, schéma simple à migrer ailleurs.`)
};

const en_landing_privacy_4 = /** @type {(inputs: Landing_Privacy_4Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CSV export any time, simple schema to migrate elsewhere.`)
};

/**
* | output |
* | --- |
* | "CSV export any time, simple schema to migrate elsewhere." |
*
* @param {Landing_Privacy_4Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_privacy_4 = /** @type {((inputs?: Landing_Privacy_4Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Privacy_4Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_privacy_4(inputs)
	return en_landing_privacy_4(inputs)
});