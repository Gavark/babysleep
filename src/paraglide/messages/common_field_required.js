/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Field_RequiredInputs */

const fr_common_field_required = /** @type {(inputs: Common_Field_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce champ est requis.`)
};

const en_common_field_required = /** @type {(inputs: Common_Field_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This field is required.`)
};

/**
* | output |
* | --- |
* | "This field is required." |
*
* @param {Common_Field_RequiredInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
const common_field_required = /** @type {((inputs?: Common_Field_RequiredInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Field_RequiredInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_field_required(inputs)
	return en_common_field_required(inputs)
});
export { common_field_required as "common.field.required" }