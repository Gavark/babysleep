/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Delete_ConfirmInputs */

const fr_baby_form_delete_confirm = /** @type {(inputs: Baby_Form_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer ce bébé et tout son historique ?`)
};

const en_baby_form_delete_confirm = /** @type {(inputs: Baby_Form_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this baby and all their history?`)
};

/**
* | output |
* | --- |
* | "Delete this baby and all their history?" |
*
* @param {Baby_Form_Delete_ConfirmInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_delete_confirm = /** @type {((inputs?: Baby_Form_Delete_ConfirmInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Delete_ConfirmInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_delete_confirm(inputs)
	return en_baby_form_delete_confirm(inputs)
});