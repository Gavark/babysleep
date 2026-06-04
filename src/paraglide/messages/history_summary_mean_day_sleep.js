/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Summary_Mean_Day_SleepInputs */

const fr_history_summary_mean_day_sleep = /** @type {(inputs: History_Summary_Mean_Day_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jour moyen`)
};

const en_history_summary_mean_day_sleep = /** @type {(inputs: History_Summary_Mean_Day_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mean day sleep`)
};

/**
* | output |
* | --- |
* | "Mean day sleep" |
*
* @param {History_Summary_Mean_Day_SleepInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_summary_mean_day_sleep = /** @type {((inputs?: History_Summary_Mean_Day_SleepInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Summary_Mean_Day_SleepInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_summary_mean_day_sleep(inputs)
	return en_history_summary_mean_day_sleep(inputs)
});