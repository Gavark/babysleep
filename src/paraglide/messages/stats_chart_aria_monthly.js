/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown>, min: NonNullable<unknown>, avg: NonNullable<unknown>, max: NonNullable<unknown> }} Stats_Chart_Aria_MonthlyInputs */

const fr_stats_chart_aria_monthly = /** @type {(inputs: Stats_Chart_Aria_MonthlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}, tous les mois enregistrés. Au minimum ${i?.min}, en moyenne ${i?.avg}, au maximum ${i?.max}.`)
};

const en_stats_chart_aria_monthly = /** @type {(inputs: Stats_Chart_Aria_MonthlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}, all recorded months. Minimum ${i?.min}, average ${i?.avg}, maximum ${i?.max}.`)
};

/**
* | output |
* | --- |
* | "{name}, all recorded months. Minimum {min}, average {avg}, maximum {max}." |
*
* @param {Stats_Chart_Aria_MonthlyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_aria_monthly = /** @type {((inputs: Stats_Chart_Aria_MonthlyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Aria_MonthlyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_aria_monthly(inputs)
	return en_stats_chart_aria_monthly(inputs)
});