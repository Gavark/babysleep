/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} Csv_Header_Nap_StartInputs */

const fr_csv_header_nap_start = /** @type {(inputs: Csv_Header_Nap_StartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} début`)
};

const en_csv_header_nap_start = /** @type {(inputs: Csv_Header_Nap_StartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} start`)
};

/**
* | output |
* | --- |
* | "S{n} start" |
*
* @param {Csv_Header_Nap_StartInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_nap_start = /** @type {((inputs: Csv_Header_Nap_StartInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_Nap_StartInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_nap_start(inputs)
	return en_csv_header_nap_start(inputs)
});