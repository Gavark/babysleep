/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_No_DevicesInputs */

const fr_notif_no_devices = /** @type {(inputs: Notif_No_DevicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun appareil abonné pour l'instant.`)
};

const en_notif_no_devices = /** @type {(inputs: Notif_No_DevicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No devices subscribed yet.`)
};

/**
* | output |
* | --- |
* | "No devices subscribed yet." |
*
* @param {Notif_No_DevicesInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_no_devices = /** @type {((inputs?: Notif_No_DevicesInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_No_DevicesInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_no_devices(inputs)
	return en_notif_no_devices(inputs)
});