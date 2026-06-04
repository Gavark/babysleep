/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_New_LabelInputs */

const fr_account_password_new_label = /** @type {(inputs: Account_Password_New_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau (≥ 10 caractères)`)
};

const en_account_password_new_label = /** @type {(inputs: Account_Password_New_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New (≥ 10 characters)`)
};

/**
* | output |
* | --- |
* | "New (≥ 10 characters)" |
*
* @param {Account_Password_New_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_new_label = /** @type {((inputs?: Account_Password_New_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_New_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_new_label(inputs)
	return en_account_password_new_label(inputs)
});