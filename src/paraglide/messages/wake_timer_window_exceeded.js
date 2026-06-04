/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Wake_Timer_Window_ExceededInputs */

const fr_wake_timer_window_exceeded = /** @type {(inputs: Wake_Timer_Window_ExceededInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fenêtre dépassée de ${i?.duration}`)
};

const en_wake_timer_window_exceeded = /** @type {(inputs: Wake_Timer_Window_ExceededInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Window exceeded by ${i?.duration}`)
};

/**
* | output |
* | --- |
* | "Window exceeded by {duration}" |
*
* @param {Wake_Timer_Window_ExceededInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_window_exceeded = /** @type {((inputs: Wake_Timer_Window_ExceededInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Window_ExceededInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_window_exceeded(inputs)
	return en_wake_timer_window_exceeded(inputs)
});