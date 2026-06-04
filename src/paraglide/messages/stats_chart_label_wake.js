/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Label_WakeInputs */

const fr_stats_chart_label_wake = /** @type {(inputs: Stats_Chart_Label_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réveil`)
};

const en_stats_chart_label_wake = /** @type {(inputs: Stats_Chart_Label_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wake-up`)
};

/**
* | output |
* | --- |
* | "Wake-up" |
*
* @param {Stats_Chart_Label_WakeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_label_wake = /** @type {((inputs?: Stats_Chart_Label_WakeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Label_WakeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_label_wake(inputs)
	return en_stats_chart_label_wake(inputs)
});