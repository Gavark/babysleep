/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Signup_Bad_TokenInputs */

const fr_auth_signup_bad_token = /** @type {(inputs: Auth_Signup_Bad_TokenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lien d'invitation invalide ou expiré.`)
};

const en_auth_signup_bad_token = /** @type {(inputs: Auth_Signup_Bad_TokenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid or expired invitation link.`)
};

/**
* | output |
* | --- |
* | "Invalid or expired invitation link." |
*
* @param {Auth_Signup_Bad_TokenInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_signup_bad_token = /** @type {((inputs?: Auth_Signup_Bad_TokenInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signup_Bad_TokenInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_signup_bad_token(inputs)
	return en_auth_signup_bad_token(inputs)
});