/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Update_Not_FoundInputs */

const fr_baby_form_update_not_found = /** @type {(inputs: Baby_Form_Update_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bébé introuvable.`)
};

const en_baby_form_update_not_found = /** @type {(inputs: Baby_Form_Update_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Baby not found.`)
};

/**
* | output |
* | --- |
* | "Baby not found." |
*
* @param {Baby_Form_Update_Not_FoundInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_update_not_found = /** @type {((inputs?: Baby_Form_Update_Not_FoundInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Update_Not_FoundInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_update_not_found(inputs)
	return en_baby_form_update_not_found(inputs)
});