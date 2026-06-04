/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_End_NapInputs */

const fr_wake_timer_end_nap = /** @type {(inputs: Wake_Timer_End_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terminer sieste maintenant`)
};

const en_wake_timer_end_nap = /** @type {(inputs: Wake_Timer_End_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`End nap now`)
};

/**
* | output |
* | --- |
* | "End nap now" |
*
* @param {Wake_Timer_End_NapInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_end_nap = /** @type {((inputs?: Wake_Timer_End_NapInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_End_NapInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_end_nap(inputs)
	return en_wake_timer_end_nap(inputs)
});