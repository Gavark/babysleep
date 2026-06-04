/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Signup_Duplicate_EmailInputs */

const fr_auth_signup_duplicate_email = /** @type {(inputs: Auth_Signup_Duplicate_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un compte existe déjà avec cet email.`)
};

const en_auth_signup_duplicate_email = /** @type {(inputs: Auth_Signup_Duplicate_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An account already exists with this email.`)
};

/**
* | output |
* | --- |
* | "An account already exists with this email." |
*
* @param {Auth_Signup_Duplicate_EmailInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_signup_duplicate_email = /** @type {((inputs?: Auth_Signup_Duplicate_EmailInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signup_Duplicate_EmailInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_signup_duplicate_email(inputs)
	return en_auth_signup_duplicate_email(inputs)
});