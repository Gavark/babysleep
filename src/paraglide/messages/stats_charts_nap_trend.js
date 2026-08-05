/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Nap_TrendInputs */

const fr_stats_charts_nap_trend = /** @type {(inputs: Stats_Charts_Nap_TrendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Évolution des siestes`)
};

const en_stats_charts_nap_trend = /** @type {(inputs: Stats_Charts_Nap_TrendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nap trend`)
};

/**
* | output |
* | --- |
* | "Nap trend" |
*
* @param {Stats_Charts_Nap_TrendInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_nap_trend = /** @type {((inputs?: Stats_Charts_Nap_TrendInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Nap_TrendInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_nap_trend(inputs)
	return en_stats_charts_nap_trend(inputs)
});