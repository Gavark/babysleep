/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Password_Too_ShortInputs */

const fr_auth_password_too_short = /** @type {(inputs: Auth_Password_Too_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mot de passe trop court (≥ 10 caractères).`)
};

const en_auth_password_too_short = /** @type {(inputs: Auth_Password_Too_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password too short (≥ 10 characters).`)
};

/**
* | output |
* | --- |
* | "Password too short (≥ 10 characters)." |
*
* @param {Auth_Password_Too_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_password_too_short = /** @type {((inputs?: Auth_Password_Too_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_Too_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_password_too_short(inputs)
	return en_auth_password_too_short(inputs)
});