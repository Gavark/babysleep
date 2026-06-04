/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Sessions_RevokeInputs */

const fr_account_sessions_revoke = /** @type {(inputs: Account_Sessions_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Révoquer`)
};

const en_account_sessions_revoke = /** @type {(inputs: Account_Sessions_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke`)
};

/**
* | output |
* | --- |
* | "Revoke" |
*
* @param {Account_Sessions_RevokeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_sessions_revoke = /** @type {((inputs?: Account_Sessions_RevokeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Sessions_RevokeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_sessions_revoke(inputs)
	return en_account_sessions_revoke(inputs)
});