/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Notifications_LinkInputs */

const fr_account_notifications_link = /** @type {(inputs: Account_Notifications_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir les paramètres de notifications →`)
};

const en_account_notifications_link = /** @type {(inputs: Account_Notifications_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open notifications settings →`)
};

/**
* | output |
* | --- |
* | "Open notifications settings →" |
*
* @param {Account_Notifications_LinkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_notifications_link = /** @type {((inputs?: Account_Notifications_LinkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Notifications_LinkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_notifications_link(inputs)
	return en_account_notifications_link(inputs)
});