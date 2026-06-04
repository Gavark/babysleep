/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Weekday_Wed_ShortInputs */

const fr_calendar_weekday_wed_short = /** @type {(inputs: Calendar_Weekday_Wed_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mer`)
};

const en_calendar_weekday_wed_short = /** @type {(inputs: Calendar_Weekday_Wed_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wed`)
};

/**
* | output |
* | --- |
* | "Wed" |
*
* @param {Calendar_Weekday_Wed_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_weekday_wed_short = /** @type {((inputs?: Calendar_Weekday_Wed_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Weekday_Wed_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_weekday_wed_short(inputs)
	return en_calendar_weekday_wed_short(inputs)
});