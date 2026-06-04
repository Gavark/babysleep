/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Signup_Invite_OnlyInputs */

const fr_auth_signup_invite_only = /** @type {(inputs: Auth_Signup_Invite_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inscription sur invitation uniquement. Demande un lien à l'administrateur.`)
};

const en_auth_signup_invite_only = /** @type {(inputs: Auth_Signup_Invite_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign-up is by invitation only. Ask an administrator for a link.`)
};

/**
* | output |
* | --- |
* | "Sign-up is by invitation only. Ask an administrator for a link." |
*
* @param {Auth_Signup_Invite_OnlyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_signup_invite_only = /** @type {((inputs?: Auth_Signup_Invite_OnlyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signup_Invite_OnlyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_signup_invite_only(inputs)
	return en_auth_signup_invite_only(inputs)
});