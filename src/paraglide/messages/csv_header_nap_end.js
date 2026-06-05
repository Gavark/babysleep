/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} Csv_Header_Nap_EndInputs */

const fr_csv_header_nap_end = /** @type {(inputs: Csv_Header_Nap_EndInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} fin`)
};

const en_csv_header_nap_end = /** @type {(inputs: Csv_Header_Nap_EndInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} end`)
};

/**
* | output |
* | --- |
* | "S{n} end" |
*
* @param {Csv_Header_Nap_EndInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_nap_end = /** @type {((inputs: Csv_Header_Nap_EndInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_Nap_EndInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_nap_end(inputs)
	return en_csv_header_nap_end(inputs)
});