/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Error_Invalid_IdInputs */

const fr_notif_error_invalid_id = /** @type {(inputs: Notif_Error_Invalid_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identifiant invalide.`)
};

const en_notif_error_invalid_id = /** @type {(inputs: Notif_Error_Invalid_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid id.`)
};

/**
* | output |
* | --- |
* | "Invalid id." |
*
* @param {Notif_Error_Invalid_IdInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_error_invalid_id = /** @type {((inputs?: Notif_Error_Invalid_IdInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Error_Invalid_IdInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_error_invalid_id(inputs)
	return en_notif_error_invalid_id(inputs)
});