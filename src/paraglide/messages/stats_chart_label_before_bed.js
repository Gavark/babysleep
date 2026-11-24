/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Label_Before_BedInputs */

const fr_stats_chart_label_before_bed = /** @type {(inputs: Stats_Chart_Label_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Éveil avant le coucher`)
};

const en_stats_chart_label_before_bed = /** @type {(inputs: Stats_Chart_Label_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awake before bedtime`)
};

/**
* | output |
* | --- |
* | "Awake before bedtime" |
*
* @param {Stats_Chart_Label_Before_BedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_label_before_bed = /** @type {((inputs?: Stats_Chart_Label_Before_BedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Label_Before_BedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_stats_chart_label_before_bed(inputs)
	return fr_stats_chart_label_before_bed(inputs)
});