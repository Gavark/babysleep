/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_CloseInputs */

const fr_common_btn_close = /** @type {(inputs: Common_Btn_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fermer`)
};

const en_common_btn_close = /** @type {(inputs: Common_Btn_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

/**
* | output |
* | --- |
* | "Close" |
*
* @param {Common_Btn_CloseInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const common_btn_close = /** @type {((inputs?: Common_Btn_CloseInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_CloseInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_close(inputs)
	return en_common_btn_close(inputs)
});