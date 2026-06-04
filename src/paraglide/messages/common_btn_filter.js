/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_FilterInputs */

const fr_common_btn_filter = /** @type {(inputs: Common_Btn_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filtrer`)
};

const en_common_btn_filter = /** @type {(inputs: Common_Btn_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter`)
};

/**
* | output |
* | --- |
* | "Filter" |
*
* @param {Common_Btn_FilterInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
const common_btn_filter = /** @type {((inputs?: Common_Btn_FilterInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_FilterInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_filter(inputs)
	return en_common_btn_filter(inputs)
});
export { common_btn_filter as "common.btn.filter" }