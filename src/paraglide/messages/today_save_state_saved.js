/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Save_State_SavedInputs */

const fr_today_save_state_saved = /** @type {(inputs: Today_Save_State_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistré`)
};

const en_today_save_state_saved = /** @type {(inputs: Today_Save_State_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

/**
* | output |
* | --- |
* | "Saved" |
*
* @param {Today_Save_State_SavedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_save_state_saved = /** @type {((inputs?: Today_Save_State_SavedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Save_State_SavedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_save_state_saved(inputs)
	return fr_today_save_state_saved(inputs)
});