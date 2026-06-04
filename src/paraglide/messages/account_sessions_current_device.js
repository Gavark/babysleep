/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Sessions_Current_DeviceInputs */

const fr_account_sessions_current_device = /** @type {(inputs: Account_Sessions_Current_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`cet appareil`)
};

const en_account_sessions_current_device = /** @type {(inputs: Account_Sessions_Current_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`this device`)
};

/**
* | output |
* | --- |
* | "this device" |
*
* @param {Account_Sessions_Current_DeviceInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_sessions_current_device = /** @type {((inputs?: Account_Sessions_Current_DeviceInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Sessions_Current_DeviceInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_sessions_current_device(inputs)
	return en_account_sessions_current_device(inputs)
});