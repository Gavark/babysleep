/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ when: NonNullable<unknown> }} Account_Sessions_Expires_OnInputs */

const fr_account_sessions_expires_on = /** @type {(inputs: Account_Sessions_Expires_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`expire le ${i?.when}`)
};

const en_account_sessions_expires_on = /** @type {(inputs: Account_Sessions_Expires_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`expires on ${i?.when}`)
};

/**
* | output |
* | --- |
* | "expires on {when}" |
*
* @param {Account_Sessions_Expires_OnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_sessions_expires_on = /** @type {((inputs: Account_Sessions_Expires_OnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Sessions_Expires_OnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_sessions_expires_on(inputs)
	return en_account_sessions_expires_on(inputs)
});