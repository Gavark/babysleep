/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Smoothing_RollingInputs */

const fr_stats_chart_smoothing_rolling = /** @type {(inputs: Stats_Chart_Smoothing_RollingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moyenne glissante sur 7 jours`)
};

const en_stats_chart_smoothing_rolling = /** @type {(inputs: Stats_Chart_Smoothing_RollingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`7-day rolling average`)
};

/**
* | output |
* | --- |
* | "7-day rolling average" |
*
* @param {Stats_Chart_Smoothing_RollingInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_smoothing_rolling = /** @type {((inputs?: Stats_Chart_Smoothing_RollingInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Smoothing_RollingInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_smoothing_rolling(inputs)
	return en_stats_chart_smoothing_rolling(inputs)
});