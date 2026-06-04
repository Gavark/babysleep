/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_Form_Birthdate_LabelInputs */

const fr_babies_form_birthdate_label = /** @type {(inputs: Babies_Form_Birthdate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date de naissance`)
};

const en_babies_form_birthdate_label = /** @type {(inputs: Babies_Form_Birthdate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date of birth`)
};

/**
* | output |
* | --- |
* | "Date of birth" |
*
* @param {Babies_Form_Birthdate_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_form_birthdate_label = /** @type {((inputs?: Babies_Form_Birthdate_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_Form_Birthdate_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_form_birthdate_label(inputs)
	return en_babies_form_birthdate_label(inputs)
});