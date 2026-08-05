/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown>, days: NonNullable<unknown> }} Stats_Chart_Nap_Rank_TickInputs */

const fr_stats_chart_nap_rank_tick = /** @type {(inputs: Stats_Chart_Nap_Rank_TickInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sieste ${i?.n} (${i?.days} j)`)
};

const en_stats_chart_nap_rank_tick = /** @type {(inputs: Stats_Chart_Nap_Rank_TickInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nap ${i?.n} (${i?.days} d)`)
};

/**
* | output |
* | --- |
* | "Nap {n} ({days} d)" |
*
* @param {Stats_Chart_Nap_Rank_TickInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_nap_rank_tick = /** @type {((inputs: Stats_Chart_Nap_Rank_TickInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Nap_Rank_TickInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_nap_rank_tick(inputs)
	return en_stats_chart_nap_rank_tick(inputs)
});