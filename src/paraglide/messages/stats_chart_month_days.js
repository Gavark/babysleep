/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Stats_Chart_Month_DaysInputs */

const fr_stats_chart_month_days = /** @type {(inputs: Stats_Chart_Month_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`(${i?.days} j)`)
};

const en_stats_chart_month_days = /** @type {(inputs: Stats_Chart_Month_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`(${i?.days} d)`)
};

/**
* | output |
* | --- |
* | "({days} d)" |
*
* @param {Stats_Chart_Month_DaysInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_month_days = /** @type {((inputs: Stats_Chart_Month_DaysInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Month_DaysInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_month_days(inputs)
	return en_stats_chart_month_days(inputs)
});