/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_Form_Desired_Wake_Label_OptionalInputs */

const fr_babies_form_desired_wake_label_optional = /** @type {(inputs: Babies_Form_Desired_Wake_Label_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heure de réveil souhaitée (facultatif)`)
};

const en_babies_form_desired_wake_label_optional = /** @type {(inputs: Babies_Form_Desired_Wake_Label_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desired wake-up time (optional)`)
};

/**
* | output |
* | --- |
* | "Desired wake-up time (optional)" |
*
* @param {Babies_Form_Desired_Wake_Label_OptionalInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_form_desired_wake_label_optional = /** @type {((inputs?: Babies_Form_Desired_Wake_Label_OptionalInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_Form_Desired_Wake_Label_OptionalInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_form_desired_wake_label_optional(inputs)
	return en_babies_form_desired_wake_label_optional(inputs)
});