/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_ConfirmInputs */

const fr_common_btn_confirm = /** @type {(inputs: Common_Btn_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer`)
};

const en_common_btn_confirm = /** @type {(inputs: Common_Btn_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm`)
};

/**
* | output |
* | --- |
* | "Confirm" |
*
* @param {Common_Btn_ConfirmInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const common_btn_confirm = /** @type {((inputs?: Common_Btn_ConfirmInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_ConfirmInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_confirm(inputs)
	return en_common_btn_confirm(inputs)
});