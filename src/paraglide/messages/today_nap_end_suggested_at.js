/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Nap_End_Suggested_AtInputs */

const fr_today_nap_end_suggested_at = /** @type {(inputs: Today_Nap_End_Suggested_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fin suggérée vers`)
};

const en_today_nap_end_suggested_at = /** @type {(inputs: Today_Nap_End_Suggested_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`End suggested around`)
};

/**
* | output |
* | --- |
* | "End suggested around" |
*
* @param {Today_Nap_End_Suggested_AtInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_nap_end_suggested_at = /** @type {((inputs?: Today_Nap_End_Suggested_AtInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Nap_End_Suggested_AtInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_nap_end_suggested_at(inputs)
	return en_today_nap_end_suggested_at(inputs)
});