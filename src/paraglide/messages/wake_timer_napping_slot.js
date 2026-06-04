/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} Wake_Timer_Napping_SlotInputs */

const fr_wake_timer_napping_slot = /** @type {(inputs: Wake_Timer_Napping_SlotInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sieste ${i?.n}`)
};

const en_wake_timer_napping_slot = /** @type {(inputs: Wake_Timer_Napping_SlotInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nap ${i?.n}`)
};

/**
* | output |
* | --- |
* | "Nap {n}" |
*
* @param {Wake_Timer_Napping_SlotInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_napping_slot = /** @type {((inputs: Wake_Timer_Napping_SlotInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Napping_SlotInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_napping_slot(inputs)
	return en_wake_timer_napping_slot(inputs)
});