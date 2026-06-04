/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Sessions_TitleInputs */

const fr_account_sessions_title = /** @type {(inputs: Account_Sessions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sessions actives`)
};

const en_account_sessions_title = /** @type {(inputs: Account_Sessions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active sessions`)
};

/**
* | output |
* | --- |
* | "Active sessions" |
*
* @param {Account_Sessions_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_sessions_title = /** @type {((inputs?: Account_Sessions_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Sessions_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_sessions_title(inputs)
	return en_account_sessions_title(inputs)
});