/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Notif_Section_Devices_CountInputs */

const fr_notif_section_devices_count = /** @type {(inputs: Notif_Section_Devices_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Appareils abonnés (${i?.count})`)
};

const en_notif_section_devices_count = /** @type {(inputs: Notif_Section_Devices_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Subscribed devices (${i?.count})`)
};

/**
* | output |
* | --- |
* | "Subscribed devices ({count})" |
*
* @param {Notif_Section_Devices_CountInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_section_devices_count = /** @type {((inputs: Notif_Section_Devices_CountInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Section_Devices_CountInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_section_devices_count(inputs)
	return en_notif_section_devices_count(inputs)
});