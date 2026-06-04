/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Charts_Prev_Night_HoursInputs */

const fr_stats_charts_prev_night_hours = /** @type {(inputs: Stats_Charts_Prev_Night_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée nuit précédente`)
};

const en_stats_charts_prev_night_hours = /** @type {(inputs: Stats_Charts_Prev_Night_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous-night duration`)
};

/**
* | output |
* | --- |
* | "Previous-night duration" |
*
* @param {Stats_Charts_Prev_Night_HoursInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_charts_prev_night_hours = /** @type {((inputs?: Stats_Charts_Prev_Night_HoursInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Charts_Prev_Night_HoursInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_charts_prev_night_hours(inputs)
	return en_stats_charts_prev_night_hours(inputs)
});