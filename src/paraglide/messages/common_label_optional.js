/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Label_OptionalInputs */

const fr_common_label_optional = /** @type {(inputs: Common_Label_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(facultatif)`)
};

const en_common_label_optional = /** @type {(inputs: Common_Label_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(optional)`)
};

/**
* | output |
* | --- |
* | "(optional)" |
*
* @param {Common_Label_OptionalInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
const common_label_optional = /** @type {((inputs?: Common_Label_OptionalInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Label_OptionalInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_label_optional(inputs)
	return en_common_label_optional(inputs)
});
export { common_label_optional as "common.label.optional" }