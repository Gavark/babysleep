/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Stats_Chart_Nap_Rank_TooltipInputs */

const fr_stats_chart_nap_rank_tooltip = /** @type {(inputs: Stats_Chart_Nap_Rank_TooltipInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`moyenne sur ${i?.days} jour(s)`)
};

const en_stats_chart_nap_rank_tooltip = /** @type {(inputs: Stats_Chart_Nap_Rank_TooltipInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`average over ${i?.days} day(s)`)
};

/**
* | output |
* | --- |
* | "average over {days} day(s)" |
*
* @param {Stats_Chart_Nap_Rank_TooltipInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_nap_rank_tooltip = /** @type {((inputs: Stats_Chart_Nap_Rank_TooltipInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Nap_Rank_TooltipInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_nap_rank_tooltip(inputs)
	return en_stats_chart_nap_rank_tooltip(inputs)
});