/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Timezone_TitleInputs */

const fr_account_timezone_title = /** @type {(inputs: Account_Timezone_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fuseau horaire par défaut`)
};

const en_account_timezone_title = /** @type {(inputs: Account_Timezone_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default time zone`)
};

/**
* | output |
* | --- |
* | "Default time zone" |
*
* @param {Account_Timezone_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_timezone_title = /** @type {((inputs?: Account_Timezone_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Timezone_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_timezone_title(inputs)
	return en_account_timezone_title(inputs)
});