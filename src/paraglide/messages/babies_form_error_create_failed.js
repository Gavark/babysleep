/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_Form_Error_Create_FailedInputs */

const fr_babies_form_error_create_failed = /** @type {(inputs: Babies_Form_Error_Create_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de création.`)
};

const en_babies_form_error_create_failed = /** @type {(inputs: Babies_Form_Error_Create_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Creation failed.`)
};

/**
* | output |
* | --- |
* | "Creation failed." |
*
* @param {Babies_Form_Error_Create_FailedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_form_error_create_failed = /** @type {((inputs?: Babies_Form_Error_Create_FailedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_Form_Error_Create_FailedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_form_error_create_failed(inputs)
	return en_babies_form_error_create_failed(inputs)
});