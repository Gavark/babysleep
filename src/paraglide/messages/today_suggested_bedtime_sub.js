/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Suggested_Bedtime_SubInputs */

const fr_today_suggested_bedtime_sub = /** @type {(inputs: Today_Suggested_Bedtime_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Basé sur les siestes saisies`)
};

const en_today_suggested_bedtime_sub = /** @type {(inputs: Today_Suggested_Bedtime_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Based on recorded naps`)
};

/**
* | output |
* | --- |
* | "Based on recorded naps" |
*
* @param {Today_Suggested_Bedtime_SubInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_suggested_bedtime_sub = /** @type {((inputs?: Today_Suggested_Bedtime_SubInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Suggested_Bedtime_SubInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_suggested_bedtime_sub(inputs)
	return en_today_suggested_bedtime_sub(inputs)
});