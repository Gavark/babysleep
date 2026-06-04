/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Timezone_LabelInputs */

const fr_account_timezone_label = /** @type {(inputs: Account_Timezone_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fuseau`)
};

const en_account_timezone_label = /** @type {(inputs: Account_Timezone_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time zone`)
};

/**
* | output |
* | --- |
* | "Time zone" |
*
* @param {Account_Timezone_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_timezone_label = /** @type {((inputs?: Account_Timezone_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Timezone_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_timezone_label(inputs)
	return en_account_timezone_label(inputs)
});