/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Before_BedInputs */

const fr_stats_charts_before_bed = /** @type {(inputs: Stats_Charts_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Éveil entre la dernière sieste et le coucher`)
};

const en_stats_charts_before_bed = /** @type {(inputs: Stats_Charts_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awake time from the last nap to bedtime`)
};

/**
* | output |
* | --- |
* | "Awake time from the last nap to bedtime" |
*
* @param {Stats_Charts_Before_BedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_before_bed = /** @type {((inputs?: Stats_Charts_Before_BedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Before_BedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_stats_charts_before_bed(inputs)
	return fr_stats_charts_before_bed(inputs)
});