/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Page_Meta_EditInputs */

const fr_day_page_meta_edit = /** @type {(inputs: Day_Page_Meta_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Édition d'une journée`)
};

const en_day_page_meta_edit = /** @type {(inputs: Day_Page_Meta_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Editing a day`)
};

/**
* | output |
* | --- |
* | "Editing a day" |
*
* @param {Day_Page_Meta_EditInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_page_meta_edit = /** @type {((inputs?: Day_Page_Meta_EditInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Page_Meta_EditInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_page_meta_edit(inputs)
	return en_day_page_meta_edit(inputs)
});