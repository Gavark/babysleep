/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Tooltip_Night_SleepInputs */

const fr_age_rules_tooltip_night_sleep = /** @type {(inputs: Age_Rules_Tooltip_Night_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée de sommeil nocturne recommandée pour cet âge.`)
};

const en_age_rules_tooltip_night_sleep = /** @type {(inputs: Age_Rules_Tooltip_Night_SleepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recommended night-sleep duration at this age.`)
};

/**
* | output |
* | --- |
* | "Recommended night-sleep duration at this age." |
*
* @param {Age_Rules_Tooltip_Night_SleepInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_tooltip_night_sleep = /** @type {((inputs?: Age_Rules_Tooltip_Night_SleepInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Tooltip_Night_SleepInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_tooltip_night_sleep(inputs)
	return en_age_rules_tooltip_night_sleep(inputs)
});