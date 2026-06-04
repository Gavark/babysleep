/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_MismatchInputs */

const fr_account_password_mismatch = /** @type {(inputs: Account_Password_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les nouveaux mots de passe ne correspondent pas.`)
};

const en_account_password_mismatch = /** @type {(inputs: Account_Password_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The new passwords do not match.`)
};

/**
* | output |
* | --- |
* | "The new passwords do not match." |
*
* @param {Account_Password_MismatchInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_mismatch = /** @type {((inputs?: Account_Password_MismatchInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_MismatchInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_mismatch(inputs)
	return en_account_password_mismatch(inputs)
});