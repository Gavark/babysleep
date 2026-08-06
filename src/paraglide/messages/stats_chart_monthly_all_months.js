/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Monthly_All_MonthsInputs */

const fr_stats_chart_monthly_all_months = /** @type {(inputs: Stats_Chart_Monthly_All_MonthsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tous les mois enregistrés — ce graphique ne suit pas la période sélectionnée.`)
};

const en_stats_chart_monthly_all_months = /** @type {(inputs: Stats_Chart_Monthly_All_MonthsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All recorded months — this chart does not follow the selected period.`)
};

/**
* | output |
* | --- |
* | "All recorded months — this chart does not follow the selected period." |
*
* @param {Stats_Chart_Monthly_All_MonthsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_monthly_all_months = /** @type {((inputs?: Stats_Chart_Monthly_All_MonthsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Monthly_All_MonthsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_monthly_all_months(inputs)
	return en_stats_chart_monthly_all_months(inputs)
});