/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Error_Not_FoundInputs */

const fr_notif_error_not_found = /** @type {(inputs: Notif_Error_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnement introuvable.`)
};

const en_notif_error_not_found = /** @type {(inputs: Notif_Error_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscription not found.`)
};

/**
* | output |
* | --- |
* | "Subscription not found." |
*
* @param {Notif_Error_Not_FoundInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_error_not_found = /** @type {((inputs?: Notif_Error_Not_FoundInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Error_Not_FoundInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_error_not_found(inputs)
	return en_notif_error_not_found(inputs)
});