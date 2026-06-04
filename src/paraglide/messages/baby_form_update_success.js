/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Update_SuccessInputs */

const fr_baby_form_update_success = /** @type {(inputs: Baby_Form_Update_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifications enregistrées.`)
};

const en_baby_form_update_success = /** @type {(inputs: Baby_Form_Update_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changes saved.`)
};

/**
* | output |
* | --- |
* | "Changes saved." |
*
* @param {Baby_Form_Update_SuccessInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_update_success = /** @type {((inputs?: Baby_Form_Update_SuccessInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Update_SuccessInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_update_success(inputs)
	return en_baby_form_update_success(inputs)
});