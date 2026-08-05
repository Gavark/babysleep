/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Nap_Avg_By_RankInputs */

const fr_stats_charts_nap_avg_by_rank = /** @type {(inputs: Stats_Charts_Nap_Avg_By_RankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée moyenne par sieste`)
};

const en_stats_charts_nap_avg_by_rank = /** @type {(inputs: Stats_Charts_Nap_Avg_By_RankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average duration per nap`)
};

/**
* | output |
* | --- |
* | "Average duration per nap" |
*
* @param {Stats_Charts_Nap_Avg_By_RankInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_nap_avg_by_rank = /** @type {((inputs?: Stats_Charts_Nap_Avg_By_RankInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Nap_Avg_By_RankInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_nap_avg_by_rank(inputs)
	return en_stats_charts_nap_avg_by_rank(inputs)
});