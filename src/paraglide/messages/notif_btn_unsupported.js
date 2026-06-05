/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Btn_UnsupportedInputs */

const fr_notif_btn_unsupported = /** @type {(inputs: Notif_Btn_UnsupportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications non prises en charge sur ce navigateur.`)
};

const en_notif_btn_unsupported = /** @type {(inputs: Notif_Btn_UnsupportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications not supported on this browser.`)
};

/**
* | output |
* | --- |
* | "Notifications not supported on this browser." |
*
* @param {Notif_Btn_UnsupportedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_btn_unsupported = /** @type {((inputs?: Notif_Btn_UnsupportedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Btn_UnsupportedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_btn_unsupported(inputs)
	return en_notif_btn_unsupported(inputs)
});