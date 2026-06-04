/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Locale_LabelInputs */

const fr_account_locale_label = /** @type {(inputs: Account_Locale_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue de l'interface`)
};

const en_account_locale_label = /** @type {(inputs: Account_Locale_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interface language`)
};

/**
* | output |
* | --- |
* | "Interface language" |
*
* @param {Account_Locale_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_locale_label = /** @type {((inputs?: Account_Locale_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Locale_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_locale_label(inputs)
	return en_account_locale_label(inputs)
});