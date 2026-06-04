/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_TitleInputs */

const fr_account_password_title = /** @type {(inputs: Account_Password_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer mon mot de passe`)
};

const en_account_password_title = /** @type {(inputs: Account_Password_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change my password`)
};

/**
* | output |
* | --- |
* | "Change my password" |
*
* @param {Account_Password_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_title = /** @type {((inputs?: Account_Password_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_title(inputs)
	return en_account_password_title(inputs)
});