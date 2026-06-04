/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_SubmitInputs */

const fr_account_password_submit = /** @type {(inputs: Account_Password_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier le mot de passe`)
};

const en_account_password_submit = /** @type {(inputs: Account_Password_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change password`)
};

/**
* | output |
* | --- |
* | "Change password" |
*
* @param {Account_Password_SubmitInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_submit = /** @type {((inputs?: Account_Password_SubmitInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_SubmitInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_submit(inputs)
	return en_account_password_submit(inputs)
});