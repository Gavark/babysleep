/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Home_LinkInputs */

const fr_error_home_link = /** @type {(inputs: Error_Home_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour à l'accueil`)
};

const en_error_home_link = /** @type {(inputs: Error_Home_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back home`)
};

/**
* | output |
* | --- |
* | "Back home" |
*
* @param {Error_Home_LinkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const error_home_link = /** @type {((inputs?: Error_Home_LinkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Home_LinkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_error_home_link(inputs)
	return en_error_home_link(inputs)
});