/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Signup_SubmitInputs */

const fr_auth_signup_submit = /** @type {(inputs: Auth_Signup_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer mon compte`)
};

const en_auth_signup_submit = /** @type {(inputs: Auth_Signup_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create my account`)
};

/**
* | output |
* | --- |
* | "Create my account" |
*
* @param {Auth_Signup_SubmitInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_signup_submit = /** @type {((inputs?: Auth_Signup_SubmitInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signup_SubmitInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_signup_submit(inputs)
	return en_auth_signup_submit(inputs)
});