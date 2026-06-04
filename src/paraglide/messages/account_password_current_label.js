/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Password_Current_LabelInputs */

const fr_account_password_current_label = /** @type {(inputs: Account_Password_Current_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mot de passe actuel`)
};

const en_account_password_current_label = /** @type {(inputs: Account_Password_Current_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Current password`)
};

/**
* | output |
* | --- |
* | "Current password" |
*
* @param {Account_Password_Current_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_password_current_label = /** @type {((inputs?: Account_Password_Current_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Password_Current_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_password_current_label(inputs)
	return en_account_password_current_label(inputs)
});