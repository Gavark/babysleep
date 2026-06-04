/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Weekday_Sat_ShortInputs */

const fr_calendar_weekday_sat_short = /** @type {(inputs: Calendar_Weekday_Sat_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sam`)
};

const en_calendar_weekday_sat_short = /** @type {(inputs: Calendar_Weekday_Sat_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sat`)
};

/**
* | output |
* | --- |
* | "Sat" |
*
* @param {Calendar_Weekday_Sat_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_weekday_sat_short = /** @type {((inputs?: Calendar_Weekday_Sat_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Weekday_Sat_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_weekday_sat_short(inputs)
	return en_calendar_weekday_sat_short(inputs)
});