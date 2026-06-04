/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Babies_List_TitleInputs */

const fr_babies_list_title = /** @type {(inputs: Babies_List_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mes bébés`)
};

const en_babies_list_title = /** @type {(inputs: Babies_List_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My babies`)
};

/**
* | output |
* | --- |
* | "My babies" |
*
* @param {Babies_List_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_list_title = /** @type {((inputs?: Babies_List_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_List_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_list_title(inputs)
	return en_babies_list_title(inputs)
});