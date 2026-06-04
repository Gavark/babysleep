/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_LogoutInputs */

const fr_account_logout = /** @type {(inputs: Account_LogoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se déconnecter`)
};

const en_account_logout = /** @type {(inputs: Account_LogoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign out`)
};

/**
* | output |
* | --- |
* | "Sign out" |
*
* @param {Account_LogoutInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_logout = /** @type {((inputs?: Account_LogoutInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_LogoutInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_logout(inputs)
	return en_account_logout(inputs)
});