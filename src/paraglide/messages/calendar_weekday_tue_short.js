/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Weekday_Tue_ShortInputs */

const fr_calendar_weekday_tue_short = /** @type {(inputs: Calendar_Weekday_Tue_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mar`)
};

const en_calendar_weekday_tue_short = /** @type {(inputs: Calendar_Weekday_Tue_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tue`)
};

/**
* | output |
* | --- |
* | "Tue" |
*
* @param {Calendar_Weekday_Tue_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_weekday_tue_short = /** @type {((inputs?: Calendar_Weekday_Tue_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Weekday_Tue_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_weekday_tue_short(inputs)
	return en_calendar_weekday_tue_short(inputs)
});