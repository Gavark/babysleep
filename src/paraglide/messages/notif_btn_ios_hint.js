/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Btn_Ios_HintInputs */

const fr_notif_btn_ios_hint = /** @type {(inputs: Notif_Btn_Ios_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sur iPhone : ajoute BabySleep à l'écran d'accueil, puis reviens ici pour activer les alertes.`)
};

const en_notif_btn_ios_hint = /** @type {(inputs: Notif_Btn_Ios_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On iPhone: add BabySleep to your home screen first, then come back here to enable alerts.`)
};

/**
* | output |
* | --- |
* | "On iPhone: add BabySleep to your home screen first, then come back here to enable alerts." |
*
* @param {Notif_Btn_Ios_HintInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_btn_ios_hint = /** @type {((inputs?: Notif_Btn_Ios_HintInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Btn_Ios_HintInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_btn_ios_hint(inputs)
	return en_notif_btn_ios_hint(inputs)
});