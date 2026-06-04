/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_BedtimeInputs */

const fr_stats_charts_bedtime = /** @type {(inputs: Stats_Charts_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heure de coucher`)
};

const en_stats_charts_bedtime = /** @type {(inputs: Stats_Charts_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bedtime`)
};

/**
* | output |
* | --- |
* | "Bedtime" |
*
* @param {Stats_Charts_BedtimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_bedtime = /** @type {((inputs?: Stats_Charts_BedtimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_BedtimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_bedtime(inputs)
	return en_stats_charts_bedtime(inputs)
});