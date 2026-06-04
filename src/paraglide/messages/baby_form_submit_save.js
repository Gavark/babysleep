/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Submit_SaveInputs */

const fr_baby_form_submit_save = /** @type {(inputs: Baby_Form_Submit_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer`)
};

const en_baby_form_submit_save = /** @type {(inputs: Baby_Form_Submit_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

/**
* | output |
* | --- |
* | "Save" |
*
* @param {Baby_Form_Submit_SaveInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_submit_save = /** @type {((inputs?: Baby_Form_Submit_SaveInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Submit_SaveInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_submit_save(inputs)
	return en_baby_form_submit_save(inputs)
});