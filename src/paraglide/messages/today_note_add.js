/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Note_AddInputs */

const fr_today_note_add = /** @type {(inputs: Today_Note_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une note`)
};

const en_today_note_add = /** @type {(inputs: Today_Note_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a note`)
};

/**
* | output |
* | --- |
* | "Add a note" |
*
* @param {Today_Note_AddInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_note_add = /** @type {((inputs?: Today_Note_AddInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Note_AddInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_note_add(inputs)
	return fr_today_note_add(inputs)
});