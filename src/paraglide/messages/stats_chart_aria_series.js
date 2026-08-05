/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown>, from: NonNullable<unknown>, to: NonNullable<unknown>, min: NonNullable<unknown>, avg: NonNullable<unknown>, max: NonNullable<unknown> }} Stats_Chart_Aria_SeriesInputs */

const fr_stats_chart_aria_series = /** @type {(inputs: Stats_Chart_Aria_SeriesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}, du ${i?.from} au ${i?.to}. Minimum ${i?.min}, moyenne ${i?.avg}, maximum ${i?.max}.`)
};

const en_stats_chart_aria_series = /** @type {(inputs: Stats_Chart_Aria_SeriesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}, ${i?.from} to ${i?.to}. Minimum ${i?.min}, average ${i?.avg}, maximum ${i?.max}.`)
};

/**
* | output |
* | --- |
* | "{name}, {from} to {to}. Minimum {min}, average {avg}, maximum {max}." |
*
* @param {Stats_Chart_Aria_SeriesInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_aria_series = /** @type {((inputs: Stats_Chart_Aria_SeriesInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Aria_SeriesInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_aria_series(inputs)
	return en_stats_chart_aria_series(inputs)
});