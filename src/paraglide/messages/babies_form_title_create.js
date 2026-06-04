/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_Form_Title_CreateInputs */

const fr_babies_form_title_create = /** @type {(inputs: Babies_Form_Title_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un bébé`)
};

const en_babies_form_title_create = /** @type {(inputs: Babies_Form_Title_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a baby`)
};

/**
* | output |
* | --- |
* | "Add a baby" |
*
* @param {Babies_Form_Title_CreateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_form_title_create = /** @type {((inputs?: Babies_Form_Title_CreateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_Form_Title_CreateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_form_title_create(inputs)
	return en_babies_form_title_create(inputs)
});