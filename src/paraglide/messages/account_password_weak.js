/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_WeakInputs */

const fr_account_password_weak = /** @type {(inputs: Account_Password_WeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mot de passe trop court (≥ 10 caractères).`)
};

const en_account_password_weak = /** @type {(inputs: Account_Password_WeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password too short (≥ 10 characters).`)
};

/**
* | output |
* | --- |
* | "Password too short (≥ 10 characters)." |
*
* @param {Account_Password_WeakInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_weak = /** @type {((inputs?: Account_Password_WeakInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_WeakInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_weak(inputs)
	return en_account_password_weak(inputs)
});