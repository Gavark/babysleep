/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Age_Override_LabelInputs */

const fr_baby_form_age_override_label = /** @type {(inputs: Baby_Form_Age_Override_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Âge corrigé (mois)`)
};

const en_baby_form_age_override_label = /** @type {(inputs: Baby_Form_Age_Override_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Corrected age (months)`)
};

/**
* | output |
* | --- |
* | "Corrected age (months)" |
*
* @param {Baby_Form_Age_Override_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_age_override_label = /** @type {((inputs?: Baby_Form_Age_Override_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Age_Override_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_age_override_label(inputs)
	return en_baby_form_age_override_label(inputs)
});