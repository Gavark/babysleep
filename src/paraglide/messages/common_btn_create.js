/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_CreateInputs */

const fr_common_btn_create = /** @type {(inputs: Common_Btn_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer`)
};

const en_common_btn_create = /** @type {(inputs: Common_Btn_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create`)
};

/**
* | output |
* | --- |
* | "Create" |
*
* @param {Common_Btn_CreateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const common_btn_create = /** @type {((inputs?: Common_Btn_CreateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_CreateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_create(inputs)
	return en_common_btn_create(inputs)
});