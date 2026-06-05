/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Csv_Header_DateInputs */

const fr_csv_header_date = /** @type {(inputs: Csv_Header_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

const en_csv_header_date = /** @type {(inputs: Csv_Header_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

/**
* | output |
* | --- |
* | "Date" |
*
* @param {Csv_Header_DateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_date = /** @type {((inputs?: Csv_Header_DateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_DateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_date(inputs)
	return en_csv_header_date(inputs)
});