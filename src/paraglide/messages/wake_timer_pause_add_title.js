/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Pause_Add_TitleInputs */

const fr_wake_timer_pause_add_title = /** @type {(inputs: Wake_Timer_Pause_Add_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter cette pause à la sieste en cours`)
};

const en_wake_timer_pause_add_title = /** @type {(inputs: Wake_Timer_Pause_Add_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add this pause to the current nap`)
};

/**
* | output |
* | --- |
* | "Add this pause to the current nap" |
*
* @param {Wake_Timer_Pause_Add_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_pause_add_title = /** @type {((inputs?: Wake_Timer_Pause_Add_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Pause_Add_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_pause_add_title(inputs)
	return en_wake_timer_pause_add_title(inputs)
});