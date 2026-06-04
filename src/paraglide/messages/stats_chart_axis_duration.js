/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Axis_DurationInputs */

const fr_stats_chart_axis_duration = /** @type {(inputs: Stats_Chart_Axis_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`durée`)
};

const en_stats_chart_axis_duration = /** @type {(inputs: Stats_Chart_Axis_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`duration`)
};

/**
* | output |
* | --- |
* | "duration" |
*
* @param {Stats_Chart_Axis_DurationInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_axis_duration = /** @type {((inputs?: Stats_Chart_Axis_DurationInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Axis_DurationInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_axis_duration(inputs)
	return en_stats_chart_axis_duration(inputs)
});