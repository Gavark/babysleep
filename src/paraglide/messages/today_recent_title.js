/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Recent_TitleInputs */

const fr_today_recent_title = /** @type {(inputs: Today_Recent_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`7 derniers jours`)
};

const en_today_recent_title = /** @type {(inputs: Today_Recent_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last 7 days`)
};

/**
* | output |
* | --- |
* | "Last 7 days" |
*
* @param {Today_Recent_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_recent_title = /** @type {((inputs?: Today_Recent_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Recent_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_recent_title(inputs)
	return en_today_recent_title(inputs)
});