/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Weekday_Mon_ShortInputs */

const fr_calendar_weekday_mon_short = /** @type {(inputs: Calendar_Weekday_Mon_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lun`)
};

const en_calendar_weekday_mon_short = /** @type {(inputs: Calendar_Weekday_Mon_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mon`)
};

/**
* | output |
* | --- |
* | "Mon" |
*
* @param {Calendar_Weekday_Mon_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_weekday_mon_short = /** @type {((inputs?: Calendar_Weekday_Mon_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Weekday_Mon_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_weekday_mon_short(inputs)
	return en_calendar_weekday_mon_short(inputs)
});