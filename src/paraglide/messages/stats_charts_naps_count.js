/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Naps_CountInputs */

const fr_stats_charts_naps_count = /** @type {(inputs: Stats_Charts_Naps_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nombre de siestes`)
};

const en_stats_charts_naps_count = /** @type {(inputs: Stats_Charts_Naps_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Number of naps`)
};

/**
* | output |
* | --- |
* | "Number of naps" |
*
* @param {Stats_Charts_Naps_CountInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_naps_count = /** @type {((inputs?: Stats_Charts_Naps_CountInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Naps_CountInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_naps_count(inputs)
	return en_stats_charts_naps_count(inputs)
});