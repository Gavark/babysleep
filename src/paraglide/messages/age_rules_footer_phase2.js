/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Footer_Phase2Inputs */

const fr_age_rules_footer_phase2 = /** @type {(inputs: Age_Rules_Footer_Phase2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Personnalisation par bébé à venir.`)
};

const en_age_rules_footer_phase2 = /** @type {(inputs: Age_Rules_Footer_Phase2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per-baby customization coming soon.`)
};

/**
* | output |
* | --- |
* | "Per-baby customization coming soon." |
*
* @param {Age_Rules_Footer_Phase2Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_footer_phase2 = /** @type {((inputs?: Age_Rules_Footer_Phase2Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Footer_Phase2Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_footer_phase2(inputs)
	return en_age_rules_footer_phase2(inputs)
});