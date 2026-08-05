/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Stats_Chart_Aria_EmptyInputs */

const fr_stats_chart_aria_empty = /** @type {(inputs: Stats_Chart_Aria_EmptyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} : aucune donnée sur cette période.`)
};

const en_stats_chart_aria_empty = /** @type {(inputs: Stats_Chart_Aria_EmptyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}: no data over this period.`)
};

/**
* | output |
* | --- |
* | "{name}: no data over this period." |
*
* @param {Stats_Chart_Aria_EmptyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_aria_empty = /** @type {((inputs: Stats_Chart_Aria_EmptyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Aria_EmptyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_aria_empty(inputs)
	return en_stats_chart_aria_empty(inputs)
});