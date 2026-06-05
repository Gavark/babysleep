/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Btn_ActiveInputs */

const fr_notif_btn_active = /** @type {(inputs: Notif_Btn_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alertes activées sur cet appareil.`)
};

const en_notif_btn_active = /** @type {(inputs: Notif_Btn_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alerts active on this device.`)
};

/**
* | output |
* | --- |
* | "Alerts active on this device." |
*
* @param {Notif_Btn_ActiveInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_btn_active = /** @type {((inputs?: Notif_Btn_ActiveInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Btn_ActiveInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_btn_active(inputs)
	return en_notif_btn_active(inputs)
});