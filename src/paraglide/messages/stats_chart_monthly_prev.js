/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Monthly_PrevInputs */

const fr_stats_chart_monthly_prev = /** @type {(inputs: Stats_Chart_Monthly_PrevInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois précédents`)
};

const en_stats_chart_monthly_prev = /** @type {(inputs: Stats_Chart_Monthly_PrevInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous months`)
};

/**
* | output |
* | --- |
* | "Previous months" |
*
* @param {Stats_Chart_Monthly_PrevInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_monthly_prev = /** @type {((inputs?: Stats_Chart_Monthly_PrevInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Monthly_PrevInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_monthly_prev(inputs)
	return en_stats_chart_monthly_prev(inputs)
});