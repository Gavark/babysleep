/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Add_Pause_TitleInputs */

const fr_wake_timer_add_pause_title = /** @type {(inputs: Wake_Timer_Add_Pause_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter du temps de pause (réveil court pendant la sieste)`)
};

const en_wake_timer_add_pause_title = /** @type {(inputs: Wake_Timer_Add_Pause_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add pause time (brief wake-up during the nap)`)
};

/**
* | output |
* | --- |
* | "Add pause time (brief wake-up during the nap)" |
*
* @param {Wake_Timer_Add_Pause_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_add_pause_title = /** @type {((inputs?: Wake_Timer_Add_Pause_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Add_Pause_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_add_pause_title(inputs)
	return en_wake_timer_add_pause_title(inputs)
});