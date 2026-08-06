/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Monthly_RegionInputs */

const fr_stats_chart_monthly_region = /** @type {(inputs: Stats_Chart_Monthly_RegionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Graphique défilant horizontalement`)
};

const en_stats_chart_monthly_region = /** @type {(inputs: Stats_Chart_Monthly_RegionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Horizontally scrolling chart`)
};

/**
* | output |
* | --- |
* | "Horizontally scrolling chart" |
*
* @param {Stats_Chart_Monthly_RegionInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_monthly_region = /** @type {((inputs?: Stats_Chart_Monthly_RegionInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Monthly_RegionInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_monthly_region(inputs)
	return en_stats_chart_monthly_region(inputs)
});