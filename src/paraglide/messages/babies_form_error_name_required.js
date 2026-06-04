/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_Form_Error_Name_RequiredInputs */

const fr_babies_form_error_name_required = /** @type {(inputs: Babies_Form_Error_Name_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom et date de naissance requis (YYYY-MM-DD).`)
};

const en_babies_form_error_name_required = /** @type {(inputs: Babies_Form_Error_Name_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name and date of birth required (YYYY-MM-DD).`)
};

/**
* | output |
* | --- |
* | "Name and date of birth required (YYYY-MM-DD)." |
*
* @param {Babies_Form_Error_Name_RequiredInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_form_error_name_required = /** @type {((inputs?: Babies_Form_Error_Name_RequiredInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_Form_Error_Name_RequiredInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_form_error_name_required(inputs)
	return en_babies_form_error_name_required(inputs)
});