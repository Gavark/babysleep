/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Tooltip_Before_BedInputs */

const fr_age_rules_tooltip_before_bed = /** @type {(inputs: Age_Rules_Tooltip_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée d'éveil après la dernière sieste avant le coucher du soir.`)
};

const en_age_rules_tooltip_before_bed = /** @type {(inputs: Age_Rules_Tooltip_Before_BedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awake duration between the last nap and night-time bedtime.`)
};

/**
* | output |
* | --- |
* | "Awake duration between the last nap and night-time bedtime." |
*
* @param {Age_Rules_Tooltip_Before_BedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_tooltip_before_bed = /** @type {((inputs?: Age_Rules_Tooltip_Before_BedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Tooltip_Before_BedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_tooltip_before_bed(inputs)
	return en_age_rules_tooltip_before_bed(inputs)
});