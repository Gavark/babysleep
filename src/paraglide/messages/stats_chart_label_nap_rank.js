/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} Stats_Chart_Label_Nap_RankInputs */

const fr_stats_chart_label_nap_rank = /** @type {(inputs: Stats_Chart_Label_Nap_RankInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sieste ${i?.n}`)
};

const en_stats_chart_label_nap_rank = /** @type {(inputs: Stats_Chart_Label_Nap_RankInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nap ${i?.n}`)
};

/**
* | output |
* | --- |
* | "Nap {n}" |
*
* @param {Stats_Chart_Label_Nap_RankInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_label_nap_rank = /** @type {((inputs: Stats_Chart_Label_Nap_RankInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Label_Nap_RankInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_label_nap_rank(inputs)
	return en_stats_chart_label_nap_rank(inputs)
});