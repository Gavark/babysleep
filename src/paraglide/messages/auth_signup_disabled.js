/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Signup_DisabledInputs */

const fr_auth_signup_disabled = /** @type {(inputs: Auth_Signup_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'inscription est désactivée.`)
};

const en_auth_signup_disabled = /** @type {(inputs: Auth_Signup_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign-ups are disabled.`)
};

/**
* | output |
* | --- |
* | "Sign-ups are disabled." |
*
* @param {Auth_Signup_DisabledInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_signup_disabled = /** @type {((inputs?: Auth_Signup_DisabledInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signup_DisabledInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_signup_disabled(inputs)
	return en_auth_signup_disabled(inputs)
});