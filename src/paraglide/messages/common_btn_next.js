/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_NextInputs */

const fr_common_btn_next = /** @type {(inputs: Common_Btn_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivant ›`)
};

const en_common_btn_next = /** @type {(inputs: Common_Btn_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next ›`)
};

/**
* | output |
* | --- |
* | "Next ›" |
*
* @param {Common_Btn_NextInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
const common_btn_next = /** @type {((inputs?: Common_Btn_NextInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_NextInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_next(inputs)
	return en_common_btn_next(inputs)
});
export { common_btn_next as "common.btn.next" }