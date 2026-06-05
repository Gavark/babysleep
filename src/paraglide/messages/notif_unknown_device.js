/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Unknown_DeviceInputs */

const fr_notif_unknown_device = /** @type {(inputs: Notif_Unknown_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Appareil inconnu`)
};

const en_notif_unknown_device = /** @type {(inputs: Notif_Unknown_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown device`)
};

/**
* | output |
* | --- |
* | "Unknown device" |
*
* @param {Notif_Unknown_DeviceInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_unknown_device = /** @type {((inputs?: Notif_Unknown_DeviceInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Unknown_DeviceInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_unknown_device(inputs)
	return en_notif_unknown_device(inputs)
});