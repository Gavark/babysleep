/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Btn_EnableInputs */

const fr_notif_btn_enable = /** @type {(inputs: Notif_Btn_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer les alertes de fenêtre d'éveil`)
};

const en_notif_btn_enable = /** @type {(inputs: Notif_Btn_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable wake-window alerts`)
};

/**
* | output |
* | --- |
* | "Enable wake-window alerts" |
*
* @param {Notif_Btn_EnableInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_btn_enable = /** @type {((inputs?: Notif_Btn_EnableInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Btn_EnableInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_btn_enable(inputs)
	return en_notif_btn_enable(inputs)
});