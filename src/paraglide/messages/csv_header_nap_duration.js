/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} Csv_Header_Nap_DurationInputs */

const fr_csv_header_nap_duration = /** @type {(inputs: Csv_Header_Nap_DurationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} durée`)
};

const en_csv_header_nap_duration = /** @type {(inputs: Csv_Header_Nap_DurationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} duration`)
};

/**
* | output |
* | --- |
* | "S{n} duration" |
*
* @param {Csv_Header_Nap_DurationInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_nap_duration = /** @type {((inputs: Csv_Header_Nap_DurationInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_Nap_DurationInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_nap_duration(inputs)
	return en_csv_header_nap_duration(inputs)
});