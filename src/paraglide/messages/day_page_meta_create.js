/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Page_Meta_CreateInputs */

const fr_day_page_meta_create = /** @type {(inputs: Day_Page_Meta_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Création d'une journée`)
};

const en_day_page_meta_create = /** @type {(inputs: Day_Page_Meta_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Creating a day`)
};

/**
* | output |
* | --- |
* | "Creating a day" |
*
* @param {Day_Page_Meta_CreateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_page_meta_create = /** @type {((inputs?: Day_Page_Meta_CreateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Page_Meta_CreateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_page_meta_create(inputs)
	return en_day_page_meta_create(inputs)
});