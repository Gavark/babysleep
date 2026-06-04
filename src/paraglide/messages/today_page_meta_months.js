/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ months: NonNullable<unknown> }} Today_Page_Meta_MonthsInputs */

const fr_today_page_meta_months = /** @type {(inputs: Today_Page_Meta_MonthsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.months} mois`)
};

const en_today_page_meta_months = /** @type {(inputs: Today_Page_Meta_MonthsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.months} months`)
};

/**
* | output |
* | --- |
* | "{months} months" |
*
* @param {Today_Page_Meta_MonthsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_page_meta_months = /** @type {((inputs: Today_Page_Meta_MonthsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Page_Meta_MonthsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_page_meta_months(inputs)
	return en_today_page_meta_months(inputs)
});