/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Label_NapsInputs */

const fr_stats_chart_label_naps = /** @type {(inputs: Stats_Chart_Label_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Siestes`)
};

const en_stats_chart_label_naps = /** @type {(inputs: Stats_Chart_Label_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Naps`)
};

/**
* | output |
* | --- |
* | "Naps" |
*
* @param {Stats_Chart_Label_NapsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_label_naps = /** @type {((inputs?: Stats_Chart_Label_NapsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Label_NapsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_label_naps(inputs)
	return en_stats_chart_label_naps(inputs)
});