/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Summary_Good_DaysInputs */

const fr_calendar_summary_good_days = /** @type {(inputs: Calendar_Summary_Good_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`jours au but`)
};

const en_calendar_summary_good_days = /** @type {(inputs: Calendar_Summary_Good_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`days on target`)
};

/**
* | output |
* | --- |
* | "days on target" |
*
* @param {Calendar_Summary_Good_DaysInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_summary_good_days = /** @type {((inputs?: Calendar_Summary_Good_DaysInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Summary_Good_DaysInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_summary_good_days(inputs)
	return fr_calendar_summary_good_days(inputs)
});