/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_List_Today_BtnInputs */

const fr_babies_list_today_btn = /** @type {(inputs: Babies_List_Today_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aujourd'hui`)
};

const en_babies_list_today_btn = /** @type {(inputs: Babies_List_Today_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today`)
};

/**
* | output |
* | --- |
* | "Today" |
*
* @param {Babies_List_Today_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_list_today_btn = /** @type {((inputs?: Babies_List_Today_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_List_Today_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_list_today_btn(inputs)
	return en_babies_list_today_btn(inputs)
});