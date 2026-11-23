/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Enter_Wake_BtnInputs */

const fr_today_enter_wake_btn = /** @type {(inputs: Today_Enter_Wake_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisir l'heure de réveil`)
};

const en_today_enter_wake_btn = /** @type {(inputs: Today_Enter_Wake_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter wake-up time`)
};

/**
* | output |
* | --- |
* | "Enter wake-up time" |
*
* @param {Today_Enter_Wake_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_enter_wake_btn = /** @type {((inputs?: Today_Enter_Wake_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Enter_Wake_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_enter_wake_btn(inputs)
	return fr_today_enter_wake_btn(inputs)
});