/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_Form_Name_LabelInputs */

const fr_babies_form_name_label = /** @type {(inputs: Babies_Form_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prénom`)
};

const en_babies_form_name_label = /** @type {(inputs: Babies_Form_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`First name`)
};

/**
* | output |
* | --- |
* | "First name" |
*
* @param {Babies_Form_Name_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_form_name_label = /** @type {((inputs?: Babies_Form_Name_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_Form_Name_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_form_name_label(inputs)
	return en_babies_form_name_label(inputs)
});