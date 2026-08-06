/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Monthly_EmptyInputs */

const fr_stats_chart_monthly_empty = /** @type {(inputs: Stats_Chart_Monthly_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune sieste enregistrée.`)
};

const en_stats_chart_monthly_empty = /** @type {(inputs: Stats_Chart_Monthly_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No nap recorded.`)
};

/**
* | output |
* | --- |
* | "No nap recorded." |
*
* @param {Stats_Chart_Monthly_EmptyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_monthly_empty = /** @type {((inputs?: Stats_Chart_Monthly_EmptyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Monthly_EmptyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_monthly_empty(inputs)
	return en_stats_chart_monthly_empty(inputs)
});