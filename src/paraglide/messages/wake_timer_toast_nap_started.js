/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown>, at: NonNullable<unknown> }} Wake_Timer_Toast_Nap_StartedInputs */

const fr_wake_timer_toast_nap_started = /** @type {(inputs: Wake_Timer_Toast_Nap_StartedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sieste ${i?.n} démarrée à ${i?.at}`)
};

const en_wake_timer_toast_nap_started = /** @type {(inputs: Wake_Timer_Toast_Nap_StartedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nap ${i?.n} started at ${i?.at}`)
};

/**
* | output |
* | --- |
* | "Nap {n} started at {at}" |
*
* @param {Wake_Timer_Toast_Nap_StartedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_toast_nap_started = /** @type {((inputs: Wake_Timer_Toast_Nap_StartedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Toast_Nap_StartedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_toast_nap_started(inputs)
	return en_wake_timer_toast_nap_started(inputs)
});