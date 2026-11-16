/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Save_State_SavingInputs */

const fr_today_save_state_saving = /** @type {(inputs: Today_Save_State_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrement…`)
};

const en_today_save_state_saving = /** @type {(inputs: Today_Save_State_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving…`)
};

/**
* | output |
* | --- |
* | "Saving…" |
*
* @param {Today_Save_State_SavingInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_save_state_saving = /** @type {((inputs?: Today_Save_State_SavingInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Save_State_SavingInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_save_state_saving(inputs)
	return fr_today_save_state_saving(inputs)
});