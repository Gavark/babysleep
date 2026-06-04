/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Login_InvalidInputs */

const fr_auth_login_invalid = /** @type {(inputs: Auth_Login_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identifiants invalides.`)
};

const en_auth_login_invalid = /** @type {(inputs: Auth_Login_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid credentials.`)
};

/**
* | output |
* | --- |
* | "Invalid credentials." |
*
* @param {Auth_Login_InvalidInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_login_invalid = /** @type {((inputs?: Auth_Login_InvalidInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Login_InvalidInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_login_invalid(inputs)
	return en_auth_login_invalid(inputs)
});