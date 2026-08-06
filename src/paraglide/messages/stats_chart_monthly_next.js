/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Monthly_NextInputs */

const fr_stats_chart_monthly_next = /** @type {(inputs: Stats_Chart_Monthly_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois suivants`)
};

const en_stats_chart_monthly_next = /** @type {(inputs: Stats_Chart_Monthly_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next months`)
};

/**
* | output |
* | --- |
* | "Next months" |
*
* @param {Stats_Chart_Monthly_NextInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_monthly_next = /** @type {((inputs?: Stats_Chart_Monthly_NextInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Monthly_NextInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_monthly_next(inputs)
	return en_stats_chart_monthly_next(inputs)
});