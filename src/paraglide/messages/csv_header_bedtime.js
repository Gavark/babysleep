/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Csv_Header_BedtimeInputs */

const fr_csv_header_bedtime = /** @type {(inputs: Csv_Header_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coucher`)
};

const en_csv_header_bedtime = /** @type {(inputs: Csv_Header_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bedtime`)
};

/**
* | output |
* | --- |
* | "Bedtime" |
*
* @param {Csv_Header_BedtimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_bedtime = /** @type {((inputs?: Csv_Header_BedtimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_BedtimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_bedtime(inputs)
	return en_csv_header_bedtime(inputs)
});