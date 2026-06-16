/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Col_Day_SleepInputs */

const fr_age_rules_col_day_sleep = /** @type {(inputs: Age_Rules_Col_Day_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sommeil jour`)
};

const en_age_rules_col_day_sleep = /** @type {(inputs: Age_Rules_Col_Day_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day sleep`)
};

/**
* | output |
* | --- |
* | "Day sleep" |
*
* @param {Age_Rules_Col_Day_SleepInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_col_day_sleep = /** @type {((inputs?: Age_Rules_Col_Day_SleepInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Col_Day_SleepInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_col_day_sleep(inputs)
	return en_age_rules_col_day_sleep(inputs)
});