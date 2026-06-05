/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Section_This_DeviceInputs */

const fr_notif_section_this_device = /** @type {(inputs: Notif_Section_This_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cet appareil`)
};

const en_notif_section_this_device = /** @type {(inputs: Notif_Section_This_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This device`)
};

/**
* | output |
* | --- |
* | "This device" |
*
* @param {Notif_Section_This_DeviceInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_section_this_device = /** @type {((inputs?: Notif_Section_This_DeviceInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Section_This_DeviceInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_section_this_device(inputs)
	return en_notif_section_this_device(inputs)
});