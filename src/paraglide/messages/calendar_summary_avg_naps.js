/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Summary_Avg_NapsInputs */

const fr_calendar_summary_avg_naps = /** @type {(inputs: Calendar_Summary_Avg_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`siestes / jour`)
};

const en_calendar_summary_avg_naps = /** @type {(inputs: Calendar_Summary_Avg_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`naps / day`)
};

/**
* | output |
* | --- |
* | "naps / day" |
*
* @param {Calendar_Summary_Avg_NapsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_summary_avg_naps = /** @type {((inputs?: Calendar_Summary_Avg_NapsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Summary_Avg_NapsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_summary_avg_naps(inputs)
	return fr_calendar_summary_avg_naps(inputs)
});