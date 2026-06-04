/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Back_To_AppInputs */

const fr_account_back_to_app = /** @type {(inputs: Account_Back_To_AppInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Application`)
};

const en_account_back_to_app = /** @type {(inputs: Account_Back_To_AppInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Application`)
};

/**
* | output |
* | --- |
* | "Application" |
*
* @param {Account_Back_To_AppInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_back_to_app = /** @type {((inputs?: Account_Back_To_AppInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Back_To_AppInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_back_to_app(inputs)
	return en_account_back_to_app(inputs)
});