/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Entry_Save_FailedInputs */

const fr_today_entry_save_failed = /** @type {(inputs: Today_Entry_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de l'enregistrement. Vérifie ta connexion et réessaie.`)
};

const en_today_entry_save_failed = /** @type {(inputs: Today_Entry_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save failed. Check your connection and try again.`)
};

/**
* | output |
* | --- |
* | "Save failed. Check your connection and try again." |
*
* @param {Today_Entry_Save_FailedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_entry_save_failed = /** @type {((inputs?: Today_Entry_Save_FailedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Entry_Save_FailedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_entry_save_failed(inputs)
	return en_today_entry_save_failed(inputs)
});