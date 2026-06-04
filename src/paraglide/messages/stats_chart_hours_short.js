/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ h: NonNullable<unknown> }} Stats_Chart_Hours_ShortInputs */

const fr_stats_chart_hours_short = /** @type {(inputs: Stats_Chart_Hours_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.h}h`)
};

const en_stats_chart_hours_short = /** @type {(inputs: Stats_Chart_Hours_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.h}h`)
};

/**
* | output |
* | --- |
* | "{h}h" |
*
* @param {Stats_Chart_Hours_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_hours_short = /** @type {((inputs: Stats_Chart_Hours_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Hours_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_hours_short(inputs)
	return en_stats_chart_hours_short(inputs)
});