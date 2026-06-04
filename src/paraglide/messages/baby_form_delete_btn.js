/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Delete_BtnInputs */

const fr_baby_form_delete_btn = /** @type {(inputs: Baby_Form_Delete_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer ce bébé`)
};

const en_baby_form_delete_btn = /** @type {(inputs: Baby_Form_Delete_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this baby`)
};

/**
* | output |
* | --- |
* | "Delete this baby" |
*
* @param {Baby_Form_Delete_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_delete_btn = /** @type {((inputs?: Baby_Form_Delete_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Delete_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_delete_btn(inputs)
	return en_baby_form_delete_btn(inputs)
});