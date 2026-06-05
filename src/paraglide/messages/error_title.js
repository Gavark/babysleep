/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ status: NonNullable<unknown> }} Error_TitleInputs */

const fr_error_title = /** @type {(inputs: Error_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Erreur ${i?.status}`)
};

const en_error_title = /** @type {(inputs: Error_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Error ${i?.status}`)
};

/**
* | output |
* | --- |
* | "Error {status}" |
*
* @param {Error_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const error_title = /** @type {((inputs: Error_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_error_title(inputs)
	return en_error_title(inputs)
});