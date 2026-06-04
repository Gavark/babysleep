/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ night: NonNullable<unknown> }} Today_Page_Meta_NightInputs */

const fr_today_page_meta_night = /** @type {(inputs: Today_Page_Meta_NightInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`nuit ${i?.night}h`)
};

const en_today_page_meta_night = /** @type {(inputs: Today_Page_Meta_NightInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`night ${i?.night}h`)
};

/**
* | output |
* | --- |
* | "night {night}h" |
*
* @param {Today_Page_Meta_NightInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_page_meta_night = /** @type {((inputs: Today_Page_Meta_NightInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Page_Meta_NightInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_page_meta_night(inputs)
	return en_today_page_meta_night(inputs)
});