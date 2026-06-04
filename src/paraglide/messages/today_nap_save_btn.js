/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Nap_Save_BtnInputs */

const fr_today_nap_save_btn = /** @type {(inputs: Today_Nap_Save_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauvegarder`)
};

const en_today_nap_save_btn = /** @type {(inputs: Today_Nap_Save_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

/**
* | output |
* | --- |
* | "Save" |
*
* @param {Today_Nap_Save_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_nap_save_btn = /** @type {((inputs?: Today_Nap_Save_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Nap_Save_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_nap_save_btn(inputs)
	return en_today_nap_save_btn(inputs)
});