/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Start_NapInputs */

const fr_wake_timer_start_nap = /** @type {(inputs: Wake_Timer_Start_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Démarrer sieste maintenant`)
};

const en_wake_timer_start_nap = /** @type {(inputs: Wake_Timer_Start_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start nap now`)
};

/**
* | output |
* | --- |
* | "Start nap now" |
*
* @param {Wake_Timer_Start_NapInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_start_nap = /** @type {((inputs?: Wake_Timer_Start_NapInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Start_NapInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_start_nap(inputs)
	return en_wake_timer_start_nap(inputs)
});