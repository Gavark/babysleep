/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_PreviousInputs */

const fr_common_btn_previous = /** @type {(inputs: Common_Btn_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`‹ Précédent`)
};

const en_common_btn_previous = /** @type {(inputs: Common_Btn_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`‹ Previous`)
};

/**
* | output |
* | --- |
* | "‹ Previous" |
*
* @param {Common_Btn_PreviousInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const common_btn_previous = /** @type {((inputs?: Common_Btn_PreviousInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_PreviousInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_previous(inputs)
	return en_common_btn_previous(inputs)
});