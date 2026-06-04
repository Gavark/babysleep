/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Locale_Option_FrInputs */

const fr_account_locale_option_fr = /** @type {(inputs: Account_Locale_Option_FrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Français`)
};

const en_account_locale_option_fr = /** @type {(inputs: Account_Locale_Option_FrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Français`)
};

/**
* | output |
* | --- |
* | "Français" |
*
* @param {Account_Locale_Option_FrInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_locale_option_fr = /** @type {((inputs?: Account_Locale_Option_FrInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Locale_Option_FrInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_locale_option_fr(inputs)
	return en_account_locale_option_fr(inputs)
});