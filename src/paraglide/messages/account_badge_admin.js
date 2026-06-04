/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Badge_AdminInputs */

const fr_account_badge_admin = /** @type {(inputs: Account_Badge_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`admin`)
};

const en_account_badge_admin = /** @type {(inputs: Account_Badge_AdminInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`admin`)
};

/**
* | output |
* | --- |
* | "admin" |
*
* @param {Account_Badge_AdminInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_badge_admin = /** @type {((inputs?: Account_Badge_AdminInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Badge_AdminInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_badge_admin(inputs)
	return en_account_badge_admin(inputs)
});