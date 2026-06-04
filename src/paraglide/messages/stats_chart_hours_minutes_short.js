/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ h: NonNullable<unknown>, mm: NonNullable<unknown> }} Stats_Chart_Hours_Minutes_ShortInputs */

const fr_stats_chart_hours_minutes_short = /** @type {(inputs: Stats_Chart_Hours_Minutes_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.h}h${i?.mm}`)
};

const en_stats_chart_hours_minutes_short = /** @type {(inputs: Stats_Chart_Hours_Minutes_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.h}h${i?.mm}`)
};

/**
* | output |
* | --- |
* | "{h}h{mm}" |
*
* @param {Stats_Chart_Hours_Minutes_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_hours_minutes_short = /** @type {((inputs: Stats_Chart_Hours_Minutes_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Hours_Minutes_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_hours_minutes_short(inputs)
	return en_stats_chart_hours_minutes_short(inputs)
});