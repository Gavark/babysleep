/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Signup_TitleInputs */

const fr_auth_signup_title = /** @type {(inputs: Auth_Signup_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inscription`)
};

const en_auth_signup_title = /** @type {(inputs: Auth_Signup_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign up`)
};

/**
* | output |
* | --- |
* | "Sign up" |
*
* @param {Auth_Signup_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_signup_title = /** @type {((inputs?: Auth_Signup_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signup_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_signup_title(inputs)
	return en_auth_signup_title(inputs)
});