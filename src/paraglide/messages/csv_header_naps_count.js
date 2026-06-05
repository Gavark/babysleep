/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Csv_Header_Naps_CountInputs */

const fr_csv_header_naps_count = /** @type {(inputs: Csv_Header_Naps_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nb siestes`)
};

const en_csv_header_naps_count = /** @type {(inputs: Csv_Header_Naps_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nap count`)
};

/**
* | output |
* | --- |
* | "Nap count" |
*
* @param {Csv_Header_Naps_CountInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_naps_count = /** @type {((inputs?: Csv_Header_Naps_CountInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_Naps_CountInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_naps_count(inputs)
	return en_csv_header_naps_count(inputs)
});