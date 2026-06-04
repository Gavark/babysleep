/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_BackInputs */

const fr_common_btn_back = /** @type {(inputs: Common_Btn_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour`)
};

const en_common_btn_back = /** @type {(inputs: Common_Btn_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back`)
};

/**
* | output |
* | --- |
* | "Back" |
*
* @param {Common_Btn_BackInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
const common_btn_back = /** @type {((inputs?: Common_Btn_BackInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_BackInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_back(inputs)
	return en_common_btn_back(inputs)
});
export { common_btn_back as "common.btn.back" }