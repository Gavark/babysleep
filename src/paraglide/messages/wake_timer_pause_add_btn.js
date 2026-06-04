/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Pause_Add_BtnInputs */

const fr_wake_timer_pause_add_btn = /** @type {(inputs: Wake_Timer_Pause_Add_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter`)
};

const en_wake_timer_pause_add_btn = /** @type {(inputs: Wake_Timer_Pause_Add_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add`)
};

/**
* | output |
* | --- |
* | "Add" |
*
* @param {Wake_Timer_Pause_Add_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_pause_add_btn = /** @type {((inputs?: Wake_Timer_Pause_Add_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Pause_Add_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_pause_add_btn(inputs)
	return en_wake_timer_pause_add_btn(inputs)
});