/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Connected_AsInputs */

const fr_account_connected_as = /** @type {(inputs: Account_Connected_AsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connecté en tant que`)
};

const en_account_connected_as = /** @type {(inputs: Account_Connected_AsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed in as`)
};

/**
* | output |
* | --- |
* | "Signed in as" |
*
* @param {Account_Connected_AsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_connected_as = /** @type {((inputs?: Account_Connected_AsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Connected_AsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_connected_as(inputs)
	return en_account_connected_as(inputs)
});