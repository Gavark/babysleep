/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_Confirm_LabelInputs */

const fr_account_password_confirm_label = /** @type {(inputs: Account_Password_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer`)
};

const en_account_password_confirm_label = /** @type {(inputs: Account_Password_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm`)
};

/**
* | output |
* | --- |
* | "Confirm" |
*
* @param {Account_Password_Confirm_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_confirm_label = /** @type {((inputs?: Account_Password_Confirm_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_Confirm_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_confirm_label(inputs)
	return en_account_password_confirm_label(inputs)
});