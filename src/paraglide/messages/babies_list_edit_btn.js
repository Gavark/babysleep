/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_List_Edit_BtnInputs */

const fr_babies_list_edit_btn = /** @type {(inputs: Babies_List_Edit_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Éditer`)
};

const en_babies_list_edit_btn = /** @type {(inputs: Babies_List_Edit_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit`)
};

/**
* | output |
* | --- |
* | "Edit" |
*
* @param {Babies_List_Edit_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_list_edit_btn = /** @type {((inputs?: Babies_List_Edit_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_List_Edit_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_list_edit_btn(inputs)
	return en_babies_list_edit_btn(inputs)
});