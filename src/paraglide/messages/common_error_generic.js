/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Error_GenericInputs */

const fr_common_error_generic = /** @type {(inputs: Common_Error_GenericInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une erreur est survenue.`)
};

const en_common_error_generic = /** @type {(inputs: Common_Error_GenericInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Something went wrong.`)
};

/**
* | output |
* | --- |
* | "Something went wrong." |
*
* @param {Common_Error_GenericInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const common_error_generic = /** @type {((inputs?: Common_Error_GenericInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Error_GenericInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_error_generic(inputs)
	return en_common_error_generic(inputs)
});