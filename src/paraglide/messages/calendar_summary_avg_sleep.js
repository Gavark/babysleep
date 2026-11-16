/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Summary_Avg_SleepInputs */

const fr_calendar_summary_avg_sleep = /** @type {(inputs: Calendar_Summary_Avg_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`sommeil moyen`)
};

const en_calendar_summary_avg_sleep = /** @type {(inputs: Calendar_Summary_Avg_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`average sleep`)
};

/**
* | output |
* | --- |
* | "average sleep" |
*
* @param {Calendar_Summary_Avg_SleepInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_summary_avg_sleep = /** @type {((inputs?: Calendar_Summary_Avg_SleepInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Summary_Avg_SleepInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_summary_avg_sleep(inputs)
	return fr_calendar_summary_avg_sleep(inputs)
});