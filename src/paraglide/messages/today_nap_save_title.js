/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Nap_Save_TitleInputs */

const fr_today_nap_save_title = /** @type {(inputs: Today_Nap_Save_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauvegarder cette sieste`)
};

const en_today_nap_save_title = /** @type {(inputs: Today_Nap_Save_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save this nap`)
};

/**
* | output |
* | --- |
* | "Save this nap" |
*
* @param {Today_Nap_Save_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_nap_save_title = /** @type {((inputs?: Today_Nap_Save_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Nap_Save_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_nap_save_title(inputs)
	return en_today_nap_save_title(inputs)
});