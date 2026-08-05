/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Smoothing_RawInputs */

const fr_stats_chart_smoothing_raw = /** @type {(inputs: Stats_Chart_Smoothing_RawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valeurs brutes par relevé`)
};

const en_stats_chart_smoothing_raw = /** @type {(inputs: Stats_Chart_Smoothing_RawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Raw values per entry`)
};

/**
* | output |
* | --- |
* | "Raw values per entry" |
*
* @param {Stats_Chart_Smoothing_RawInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_smoothing_raw = /** @type {((inputs?: Stats_Chart_Smoothing_RawInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Smoothing_RawInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_smoothing_raw(inputs)
	return en_stats_chart_smoothing_raw(inputs)
});