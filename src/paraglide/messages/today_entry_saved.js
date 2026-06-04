/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Entry_SavedInputs */

const fr_today_entry_saved = /** @type {(inputs: Today_Entry_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Journée enregistrée.`)
};

const en_today_entry_saved = /** @type {(inputs: Today_Entry_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day saved.`)
};

/**
* | output |
* | --- |
* | "Day saved." |
*
* @param {Today_Entry_SavedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_entry_saved = /** @type {((inputs?: Today_Entry_SavedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Entry_SavedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_entry_saved(inputs)
	return en_today_entry_saved(inputs)
});