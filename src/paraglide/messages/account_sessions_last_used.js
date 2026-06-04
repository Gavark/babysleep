/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ when: NonNullable<unknown> }} Account_Sessions_Last_UsedInputs */

const fr_account_sessions_last_used = /** @type {(inputs: Account_Sessions_Last_UsedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dernière activité : ${i?.when}`)
};

const en_account_sessions_last_used = /** @type {(inputs: Account_Sessions_Last_UsedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Last activity: ${i?.when}`)
};

/**
* | output |
* | --- |
* | "Last activity: {when}" |
*
* @param {Account_Sessions_Last_UsedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_sessions_last_used = /** @type {((inputs: Account_Sessions_Last_UsedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Sessions_Last_UsedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_sessions_last_used(inputs)
	return en_account_sessions_last_used(inputs)
});