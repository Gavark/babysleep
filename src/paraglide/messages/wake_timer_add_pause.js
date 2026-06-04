/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Add_PauseInputs */

const fr_wake_timer_add_pause = /** @type {(inputs: Wake_Timer_Add_PauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une pause`)
};

const en_wake_timer_add_pause = /** @type {(inputs: Wake_Timer_Add_PauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a pause`)
};

/**
* | output |
* | --- |
* | "Add a pause" |
*
* @param {Wake_Timer_Add_PauseInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_add_pause = /** @type {((inputs?: Wake_Timer_Add_PauseInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Add_PauseInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_add_pause(inputs)
	return en_wake_timer_add_pause(inputs)
});