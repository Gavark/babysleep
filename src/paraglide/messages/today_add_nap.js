/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Add_NapInputs */

const fr_today_add_nap = /** @type {(inputs: Today_Add_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une sieste`)
};

const en_today_add_nap = /** @type {(inputs: Today_Add_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a nap`)
};

/**
* | output |
* | --- |
* | "Add a nap" |
*
* @param {Today_Add_NapInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_add_nap = /** @type {((inputs?: Today_Add_NapInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Add_NapInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_add_nap(inputs)
	return en_today_add_nap(inputs)
});