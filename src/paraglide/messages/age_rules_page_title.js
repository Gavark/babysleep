/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Page_TitleInputs */

const fr_age_rules_page_title = /** @type {(inputs: Age_Rules_Page_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modèle d'âge`)
};

const en_age_rules_page_title = /** @type {(inputs: Age_Rules_Page_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Age model`)
};

/**
* | output |
* | --- |
* | "Age model" |
*
* @param {Age_Rules_Page_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_page_title = /** @type {((inputs?: Age_Rules_Page_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Page_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_page_title(inputs)
	return en_age_rules_page_title(inputs)
});