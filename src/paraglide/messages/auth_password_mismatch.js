/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Password_MismatchInputs */

const fr_auth_password_mismatch = /** @type {(inputs: Auth_Password_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les mots de passe ne correspondent pas.`)
};

const en_auth_password_mismatch = /** @type {(inputs: Auth_Password_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Passwords do not match.`)
};

/**
* | output |
* | --- |
* | "Passwords do not match." |
*
* @param {Auth_Password_MismatchInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_password_mismatch = /** @type {((inputs?: Auth_Password_MismatchInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_MismatchInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_password_mismatch(inputs)
	return en_auth_password_mismatch(inputs)
});