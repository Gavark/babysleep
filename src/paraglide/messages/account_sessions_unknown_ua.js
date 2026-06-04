/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Sessions_Unknown_UaInputs */

const fr_account_sessions_unknown_ua = /** @type {(inputs: Account_Sessions_Unknown_UaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`inconnu`)
};

const en_account_sessions_unknown_ua = /** @type {(inputs: Account_Sessions_Unknown_UaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`unknown`)
};

/**
* | output |
* | --- |
* | "unknown" |
*
* @param {Account_Sessions_Unknown_UaInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_sessions_unknown_ua = /** @type {((inputs?: Account_Sessions_Unknown_UaInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Sessions_Unknown_UaInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_sessions_unknown_ua(inputs)
	return en_account_sessions_unknown_ua(inputs)
});