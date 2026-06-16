/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Tooltip_Day_SleepInputs */

const fr_age_rules_tooltip_day_sleep = /** @type {(inputs: Age_Rules_Tooltip_Day_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée totale de sieste recommandée sur la journée.`)
};

const en_age_rules_tooltip_day_sleep = /** @type {(inputs: Age_Rules_Tooltip_Day_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recommended total daytime nap duration.`)
};

/**
* | output |
* | --- |
* | "Recommended total daytime nap duration." |
*
* @param {Age_Rules_Tooltip_Day_SleepInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_tooltip_day_sleep = /** @type {((inputs?: Age_Rules_Tooltip_Day_SleepInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Tooltip_Day_SleepInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_tooltip_day_sleep(inputs)
	return en_age_rules_tooltip_day_sleep(inputs)
});