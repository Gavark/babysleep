/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Timezone_InheritInputs */

const fr_baby_form_timezone_inherit = /** @type {(inputs: Baby_Form_Timezone_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hériter du compte`)
};

const en_baby_form_timezone_inherit = /** @type {(inputs: Baby_Form_Timezone_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inherit from account`)
};

/**
* | output |
* | --- |
* | "Inherit from account" |
*
* @param {Baby_Form_Timezone_InheritInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_timezone_inherit = /** @type {((inputs?: Baby_Form_Timezone_InheritInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Timezone_InheritInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_timezone_inherit(inputs)
	return en_baby_form_timezone_inherit(inputs)
});