/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown>, from: NonNullable<unknown>, to: NonNullable<unknown>, min: NonNullable<unknown>, avg: NonNullable<unknown>, max: NonNullable<unknown> }} Stats_Chart_Aria_TimeofdayInputs */

const fr_stats_chart_aria_timeofday = /** @type {(inputs: Stats_Chart_Aria_TimeofdayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}, du ${i?.from} au ${i?.to}. Au plus tôt ${i?.min}, en moyenne ${i?.avg}, au plus tard ${i?.max}.`)
};

const en_stats_chart_aria_timeofday = /** @type {(inputs: Stats_Chart_Aria_TimeofdayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}, ${i?.from} to ${i?.to}. Earliest ${i?.min}, average ${i?.avg}, latest ${i?.max}.`)
};

/**
* | output |
* | --- |
* | "{name}, {from} to {to}. Earliest {min}, average {avg}, latest {max}." |
*
* @param {Stats_Chart_Aria_TimeofdayInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_aria_timeofday = /** @type {((inputs: Stats_Chart_Aria_TimeofdayInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Aria_TimeofdayInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_aria_timeofday(inputs)
	return en_stats_chart_aria_timeofday(inputs)
});