/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Today_Page_Meta_NapsInputs */

const fr_today_page_meta_naps = /** @type {(inputs: Today_Page_Meta_NapsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} sieste(s)`)
};

const en_today_page_meta_naps = /** @type {(inputs: Today_Page_Meta_NapsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} nap(s)`)
};

/**
* | output |
* | --- |
* | "{count} nap(s)" |
*
* @param {Today_Page_Meta_NapsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_page_meta_naps = /** @type {((inputs: Today_Page_Meta_NapsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Page_Meta_NapsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_page_meta_naps(inputs)
	return en_today_page_meta_naps(inputs)
});