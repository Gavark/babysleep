/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} Today_Nap_Label_NInputs */

const fr_today_nap_label_n = /** @type {(inputs: Today_Nap_Label_NInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sieste ${i?.n}`)
};

const en_today_nap_label_n = /** @type {(inputs: Today_Nap_Label_NInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nap ${i?.n}`)
};

/**
* | output |
* | --- |
* | "Nap {n}" |
*
* @param {Today_Nap_Label_NInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_nap_label_n = /** @type {((inputs: Today_Nap_Label_NInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Nap_Label_NInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_nap_label_n(inputs)
	return en_today_nap_label_n(inputs)
});