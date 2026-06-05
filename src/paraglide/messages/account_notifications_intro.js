/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Notifications_IntroInputs */

const fr_account_notifications_intro = /** @type {(inputs: Account_Notifications_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gérez les abonnements push par appareil.`)
};

const en_account_notifications_intro = /** @type {(inputs: Account_Notifications_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manage push subscriptions per device.`)
};

/**
* | output |
* | --- |
* | "Manage push subscriptions per device." |
*
* @param {Account_Notifications_IntroInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const account_notifications_intro = /** @type {((inputs?: Account_Notifications_IntroInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Notifications_IntroInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_notifications_intro(inputs)
	return en_account_notifications_intro(inputs)
});