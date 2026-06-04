/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_SuccessInputs */

const fr_account_password_success = /** @type {(inputs: Account_Password_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mot de passe modifié — vos autres appareils ont été déconnectés.`)
};

const en_account_password_success = /** @type {(inputs: Account_Password_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password changed — your other devices have been signed out.`)
};

/**
* | output |
* | --- |
* | "Password changed — your other devices have been signed out." |
*
* @param {Account_Password_SuccessInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_success = /** @type {((inputs?: Account_Password_SuccessInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_SuccessInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_success(inputs)
	return en_account_password_success(inputs)
});