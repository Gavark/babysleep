/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Signup_Disabled_AdminInputs */

const fr_auth_signup_disabled_admin = /** @type {(inputs: Auth_Signup_Disabled_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inscription désactivée par l'administrateur.`)
};

const en_auth_signup_disabled_admin = /** @type {(inputs: Auth_Signup_Disabled_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign-ups have been disabled by the administrator.`)
};

/**
* | output |
* | --- |
* | "Sign-ups have been disabled by the administrator." |
*
* @param {Auth_Signup_Disabled_AdminInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_signup_disabled_admin = /** @type {((inputs?: Auth_Signup_Disabled_AdminInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signup_Disabled_AdminInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_signup_disabled_admin(inputs)
	return en_auth_signup_disabled_admin(inputs)
});