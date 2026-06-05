/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Btn_DeniedInputs */

const fr_notif_btn_denied = /** @type {(inputs: Notif_Btn_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications bloquées — active-les dans les paramètres de ton navigateur pour recevoir des alertes.`)
};

const en_notif_btn_denied = /** @type {(inputs: Notif_Btn_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications blocked — enable them from your browser settings to receive alerts.`)
};

/**
* | output |
* | --- |
* | "Notifications blocked — enable them from your browser settings to receive alerts." |
*
* @param {Notif_Btn_DeniedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_btn_denied = /** @type {((inputs?: Notif_Btn_DeniedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Btn_DeniedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_btn_denied(inputs)
	return en_notif_btn_denied(inputs)
});