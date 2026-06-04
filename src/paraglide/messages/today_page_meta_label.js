/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Today_Page_Meta_LabelInputs */

const fr_today_page_meta_label = /** @type {(inputs: Today_Page_Meta_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`(${i?.label})`)
};

const en_today_page_meta_label = /** @type {(inputs: Today_Page_Meta_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`(${i?.label})`)
};

/**
* | output |
* | --- |
* | "({label})" |
*
* @param {Today_Page_Meta_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_page_meta_label = /** @type {((inputs: Today_Page_Meta_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Page_Meta_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_page_meta_label(inputs)
	return en_today_page_meta_label(inputs)
});