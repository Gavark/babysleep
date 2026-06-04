/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Locale_TitleInputs */

const fr_account_locale_title = /** @type {(inputs: Account_Locale_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue`)
};

const en_account_locale_title = /** @type {(inputs: Account_Locale_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language`)
};

/**
* | output |
* | --- |
* | "Language" |
*
* @param {Account_Locale_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_locale_title = /** @type {((inputs?: Account_Locale_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Locale_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_locale_title(inputs)
	return en_account_locale_title(inputs)
});