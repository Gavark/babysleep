/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Label_Before_Bed_TargetInputs */

const fr_stats_chart_label_before_bed_target = /** @type {(inputs: Stats_Chart_Label_Before_Bed_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recommandé pour l'âge`)
};

const en_stats_chart_label_before_bed_target = /** @type {(inputs: Stats_Chart_Label_Before_Bed_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recommended for age`)
};

/**
* | output |
* | --- |
* | "Recommended for age" |
*
* @param {Stats_Chart_Label_Before_Bed_TargetInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_label_before_bed_target = /** @type {((inputs?: Stats_Chart_Label_Before_Bed_TargetInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Label_Before_Bed_TargetInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_stats_chart_label_before_bed_target(inputs)
	return fr_stats_chart_label_before_bed_target(inputs)
});