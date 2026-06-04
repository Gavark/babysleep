/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Timezone_SuccessInputs */

const fr_account_timezone_success = /** @type {(inputs: Account_Timezone_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fuseau horaire mis à jour.`)
};

const en_account_timezone_success = /** @type {(inputs: Account_Timezone_SuccessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time zone updated.`)
};

/**
* | output |
* | --- |
* | "Time zone updated." |
*
* @param {Account_Timezone_SuccessInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_timezone_success = /** @type {((inputs?: Account_Timezone_SuccessInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Timezone_SuccessInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_timezone_success(inputs)
	return en_account_timezone_success(inputs)
});