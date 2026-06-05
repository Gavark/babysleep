/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Back_To_AccountInputs */

const fr_notif_back_to_account = /** @type {(inputs: Notif_Back_To_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mon compte`)
};

const en_notif_back_to_account = /** @type {(inputs: Notif_Back_To_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to account`)
};

/**
* | output |
* | --- |
* | "Back to account" |
*
* @param {Notif_Back_To_AccountInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_back_to_account = /** @type {((inputs?: Notif_Back_To_AccountInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Back_To_AccountInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_back_to_account(inputs)
	return en_notif_back_to_account(inputs)
});