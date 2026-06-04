/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Locale_SuccessInputs */

const fr_account_locale_success = /** @type {(inputs: Account_Locale_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue mise à jour.`)
};

const en_account_locale_success = /** @type {(inputs: Account_Locale_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language updated.`)
};

/**
* | output |
* | --- |
* | "Language updated." |
*
* @param {Account_Locale_SuccessInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_locale_success = /** @type {((inputs?: Account_Locale_SuccessInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Locale_SuccessInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_locale_success(inputs)
	return en_account_locale_success(inputs)
});