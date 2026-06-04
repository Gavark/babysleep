/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Wake_TimeInputs */

const fr_stats_charts_wake_time = /** @type {(inputs: Stats_Charts_Wake_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heure de réveil`)
};

const en_stats_charts_wake_time = /** @type {(inputs: Stats_Charts_Wake_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wake-up time`)
};

/**
* | output |
* | --- |
* | "Wake-up time" |
*
* @param {Stats_Charts_Wake_TimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_wake_time = /** @type {((inputs?: Stats_Charts_Wake_TimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Wake_TimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_wake_time(inputs)
	return en_stats_charts_wake_time(inputs)
});