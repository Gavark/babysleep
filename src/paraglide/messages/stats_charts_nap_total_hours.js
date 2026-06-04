/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Nap_Total_HoursInputs */

const fr_stats_charts_nap_total_hours = /** @type {(inputs: Stats_Charts_Nap_Total_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sommeil total de jour`)
};

const en_stats_charts_nap_total_hours = /** @type {(inputs: Stats_Charts_Nap_Total_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total daytime sleep`)
};

/**
* | output |
* | --- |
* | "Total daytime sleep" |
*
* @param {Stats_Charts_Nap_Total_HoursInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_nap_total_hours = /** @type {((inputs?: Stats_Charts_Nap_Total_HoursInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Nap_Total_HoursInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_nap_total_hours(inputs)
	return en_stats_charts_nap_total_hours(inputs)
});