/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Invalid_EmailInputs */

const fr_auth_invalid_email = /** @type {(inputs: Auth_Invalid_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Email invalide.`)
};

const en_auth_invalid_email = /** @type {(inputs: Auth_Invalid_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid email.`)
};

/**
* | output |
* | --- |
* | "Invalid email." |
*
* @param {Auth_Invalid_EmailInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_invalid_email = /** @type {((inputs?: Auth_Invalid_EmailInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Invalid_EmailInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_invalid_email(inputs)
	return en_auth_invalid_email(inputs)
});