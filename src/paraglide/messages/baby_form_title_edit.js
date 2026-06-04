/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Baby_Form_Title_EditInputs */

const fr_baby_form_title_edit = /** @type {(inputs: Baby_Form_Title_EditInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bébé : ${i?.name}`)
};

const en_baby_form_title_edit = /** @type {(inputs: Baby_Form_Title_EditInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Baby: ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Baby: {name}" |
*
* @param {Baby_Form_Title_EditInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_title_edit = /** @type {((inputs: Baby_Form_Title_EditInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Title_EditInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_title_edit(inputs)
	return en_baby_form_title_edit(inputs)
});