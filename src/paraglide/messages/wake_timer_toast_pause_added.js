/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ min: NonNullable<unknown>, n: NonNullable<unknown> }} Wake_Timer_Toast_Pause_AddedInputs */

const fr_wake_timer_toast_pause_added = /** @type {(inputs: Wake_Timer_Toast_Pause_AddedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+${i?.min} min de pause sur sieste ${i?.n}`)
};

const en_wake_timer_toast_pause_added = /** @type {(inputs: Wake_Timer_Toast_Pause_AddedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+${i?.min} min of pause on nap ${i?.n}`)
};

/**
* | output |
* | --- |
* | "+{min} min of pause on nap {n}" |
*
* @param {Wake_Timer_Toast_Pause_AddedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_toast_pause_added = /** @type {((inputs: Wake_Timer_Toast_Pause_AddedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Toast_Pause_AddedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_toast_pause_added(inputs)
	return en_wake_timer_toast_pause_added(inputs)
});