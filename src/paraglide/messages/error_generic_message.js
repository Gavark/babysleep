/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Generic_MessageInputs */

const fr_error_generic_message = /** @type {(inputs: Error_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une erreur est survenue.`)
};

const en_error_generic_message = /** @type {(inputs: Error_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Something went wrong.`)
};

/**
* | output |
* | --- |
* | "Something went wrong." |
*
* @param {Error_Generic_MessageInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const error_generic_message = /** @type {((inputs?: Error_Generic_MessageInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Generic_MessageInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_error_generic_message(inputs)
	return en_error_generic_message(inputs)
});