/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Locale_ErrorInputs */

const fr_account_locale_error = /** @type {(inputs: Account_Locale_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Locale invalide.`)
};

const en_account_locale_error = /** @type {(inputs: Account_Locale_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid locale.`)
};

/**
* | output |
* | --- |
* | "Invalid locale." |
*
* @param {Account_Locale_ErrorInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_locale_error = /** @type {((inputs?: Account_Locale_ErrorInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Locale_ErrorInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_locale_error(inputs)
	return en_account_locale_error(inputs)
});