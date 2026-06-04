/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ window: NonNullable<unknown> }} Today_Page_Meta_WindowInputs */

const fr_today_page_meta_window = /** @type {(inputs: Today_Page_Meta_WindowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`fenêtre ${i?.window} min`)
};

const en_today_page_meta_window = /** @type {(inputs: Today_Page_Meta_WindowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`window ${i?.window} min`)
};

/**
* | output |
* | --- |
* | "window {window} min" |
*
* @param {Today_Page_Meta_WindowInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_page_meta_window = /** @type {((inputs: Today_Page_Meta_WindowInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Page_Meta_WindowInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_page_meta_window(inputs)
	return en_today_page_meta_window(inputs)
});