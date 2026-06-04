/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Label_BedtimeInputs */

const fr_stats_chart_label_bedtime = /** @type {(inputs: Stats_Chart_Label_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coucher`)
};

const en_stats_chart_label_bedtime = /** @type {(inputs: Stats_Chart_Label_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bedtime`)
};

/**
* | output |
* | --- |
* | "Bedtime" |
*
* @param {Stats_Chart_Label_BedtimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_label_bedtime = /** @type {((inputs?: Stats_Chart_Label_BedtimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Label_BedtimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_label_bedtime(inputs)
	return en_stats_chart_label_bedtime(inputs)
});