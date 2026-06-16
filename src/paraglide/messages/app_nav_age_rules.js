/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_Age_RulesInputs */

const fr_app_nav_age_rules = /** @type {(inputs: App_Nav_Age_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modèle d'âge`)
};

const en_app_nav_age_rules = /** @type {(inputs: App_Nav_Age_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Age model`)
};

/**
* | output |
* | --- |
* | "Age model" |
*
* @param {App_Nav_Age_RulesInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_age_rules = /** @type {((inputs?: App_Nav_Age_RulesInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_Age_RulesInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_age_rules(inputs)
	return en_app_nav_age_rules(inputs)
});