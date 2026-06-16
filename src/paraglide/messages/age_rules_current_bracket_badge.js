/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Current_Bracket_BadgeInputs */

const fr_age_rules_current_bracket_badge = /** @type {(inputs: Age_Rules_Current_Bracket_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`📍 Tranche actuelle`)
};

const en_age_rules_current_bracket_badge = /** @type {(inputs: Age_Rules_Current_Bracket_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`📍 Current bracket`)
};

/**
* | output |
* | --- |
* | "📍 Current bracket" |
*
* @param {Age_Rules_Current_Bracket_BadgeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_current_bracket_badge = /** @type {((inputs?: Age_Rules_Current_Bracket_BadgeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Current_Bracket_BadgeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_current_bracket_badge(inputs)
	return en_age_rules_current_bracket_badge(inputs)
});