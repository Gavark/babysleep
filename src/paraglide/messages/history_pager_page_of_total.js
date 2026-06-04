/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ page: NonNullable<unknown>, total: NonNullable<unknown> }} History_Pager_Page_Of_TotalInputs */

const fr_history_pager_page_of_total = /** @type {(inputs: History_Pager_Page_Of_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Page ${i?.page} / ${i?.total}`)
};

const en_history_pager_page_of_total = /** @type {(inputs: History_Pager_Page_Of_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Page ${i?.page} / ${i?.total}`)
};

/**
* | output |
* | --- |
* | "Page {page} / {total}" |
*
* @param {History_Pager_Page_Of_TotalInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_pager_page_of_total = /** @type {((inputs: History_Pager_Page_Of_TotalInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Pager_Page_Of_TotalInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_pager_page_of_total(inputs)
	return en_history_pager_page_of_total(inputs)
});