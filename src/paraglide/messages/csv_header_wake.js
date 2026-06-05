/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Csv_Header_WakeInputs */

const fr_csv_header_wake = /** @type {(inputs: Csv_Header_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réveil`)
};

const en_csv_header_wake = /** @type {(inputs: Csv_Header_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wake-up`)
};

/**
* | output |
* | --- |
* | "Wake-up" |
*
* @param {Csv_Header_WakeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_wake = /** @type {((inputs?: Csv_Header_WakeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_WakeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_wake(inputs)
	return en_csv_header_wake(inputs)
});