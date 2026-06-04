/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Recent_UnknownInputs */

const fr_today_recent_unknown = /** @type {(inputs: Today_Recent_UnknownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`?`)
};

const en_today_recent_unknown = /** @type {(inputs: Today_Recent_UnknownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`?`)
};

/**
* | output |
* | --- |
* | "?" |
*
* @param {Today_Recent_UnknownInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_recent_unknown = /** @type {((inputs?: Today_Recent_UnknownInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Recent_UnknownInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_recent_unknown(inputs)
	return en_today_recent_unknown(inputs)
});