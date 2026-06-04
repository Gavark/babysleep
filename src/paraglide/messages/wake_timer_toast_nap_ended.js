/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown>, at: NonNullable<unknown> }} Wake_Timer_Toast_Nap_EndedInputs */

const fr_wake_timer_toast_nap_ended = /** @type {(inputs: Wake_Timer_Toast_Nap_EndedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sieste ${i?.n} terminée à ${i?.at}`)
};

const en_wake_timer_toast_nap_ended = /** @type {(inputs: Wake_Timer_Toast_Nap_EndedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nap ${i?.n} ended at ${i?.at}`)
};

/**
* | output |
* | --- |
* | "Nap {n} ended at {at}" |
*
* @param {Wake_Timer_Toast_Nap_EndedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_toast_nap_ended = /** @type {((inputs: Wake_Timer_Toast_Nap_EndedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Toast_Nap_EndedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_toast_nap_ended(inputs)
	return en_wake_timer_toast_nap_ended(inputs)
});