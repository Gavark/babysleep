/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Col_Night_SleepInputs */

const fr_age_rules_col_night_sleep = /** @type {(inputs: Age_Rules_Col_Night_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sommeil nuit`)
};

const en_age_rules_col_night_sleep = /** @type {(inputs: Age_Rules_Col_Night_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Night sleep`)
};

/**
* | output |
* | --- |
* | "Night sleep" |
*
* @param {Age_Rules_Col_Night_SleepInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_col_night_sleep = /** @type {((inputs?: Age_Rules_Col_Night_SleepInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Col_Night_SleepInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_col_night_sleep(inputs)
	return en_age_rules_col_night_sleep(inputs)
});