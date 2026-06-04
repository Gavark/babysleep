/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_TitleInputs */

const fr_account_title = /** @type {(inputs: Account_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mon compte`)
};

const en_account_title = /** @type {(inputs: Account_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My account`)
};

/**
* | output |
* | --- |
* | "My account" |
*
* @param {Account_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_title = /** @type {((inputs?: Account_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_title(inputs)
	return en_account_title(inputs)
});