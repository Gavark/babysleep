/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Nap_MonthlyInputs */

const fr_stats_charts_nap_monthly = /** @type {(inputs: Stats_Charts_Nap_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée moyenne par sieste, mois par mois`)
};

const en_stats_charts_nap_monthly = /** @type {(inputs: Stats_Charts_Nap_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average duration per nap, month by month`)
};

/**
* | output |
* | --- |
* | "Average duration per nap, month by month" |
*
* @param {Stats_Charts_Nap_MonthlyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_nap_monthly = /** @type {((inputs?: Stats_Charts_Nap_MonthlyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Nap_MonthlyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_nap_monthly(inputs)
	return en_stats_charts_nap_monthly(inputs)
});