/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Label_Day_HoursInputs */

const fr_stats_chart_label_day_hours = /** @type {(inputs: Stats_Chart_Label_Day_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jour (h)`)
};

const en_stats_chart_label_day_hours = /** @type {(inputs: Stats_Chart_Label_Day_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day (h)`)
};

/**
* | output |
* | --- |
* | "Day (h)" |
*
* @param {Stats_Chart_Label_Day_HoursInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_label_day_hours = /** @type {((inputs?: Stats_Chart_Label_Day_HoursInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Label_Day_HoursInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_chart_label_day_hours(inputs)
	return en_stats_chart_label_day_hours(inputs)
});