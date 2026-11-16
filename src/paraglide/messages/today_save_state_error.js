/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Save_State_ErrorInputs */

const fr_today_save_state_error = /** @type {(inputs: Today_Save_State_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de l'enregistrement`)
};

const en_today_save_state_error = /** @type {(inputs: Today_Save_State_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couldn't save`)
};

/**
* | output |
* | --- |
* | "Couldn't save" |
*
* @param {Today_Save_State_ErrorInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_save_state_error = /** @type {((inputs?: Today_Save_State_ErrorInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Save_State_ErrorInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_save_state_error(inputs)
	return fr_today_save_state_error(inputs)
});