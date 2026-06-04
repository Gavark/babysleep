/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Table_NotesInputs */

const fr_history_table_notes = /** @type {(inputs: History_Table_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

const en_history_table_notes = /** @type {(inputs: History_Table_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

/**
* | output |
* | --- |
* | "Notes" |
*
* @param {History_Table_NotesInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_notes = /** @type {((inputs?: History_Table_NotesInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_NotesInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_notes(inputs)
	return en_history_table_notes(inputs)
});