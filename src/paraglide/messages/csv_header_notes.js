/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Csv_Header_NotesInputs */

const fr_csv_header_notes = /** @type {(inputs: Csv_Header_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

const en_csv_header_notes = /** @type {(inputs: Csv_Header_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

/**
* | output |
* | --- |
* | "Notes" |
*
* @param {Csv_Header_NotesInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_notes = /** @type {((inputs?: Csv_Header_NotesInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_NotesInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_notes(inputs)
	return en_csv_header_notes(inputs)
});