/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ remaining: NonNullable<unknown>, at: NonNullable<unknown> }} Wake_Timer_Next_Nap_InInputs */

const fr_wake_timer_next_nap_in = /** @type {(inputs: Wake_Timer_Next_Nap_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prochaine sieste dans ${i?.remaining} (à ${i?.at})`)
};

const en_wake_timer_next_nap_in = /** @type {(inputs: Wake_Timer_Next_Nap_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Next nap in ${i?.remaining} (at ${i?.at})`)
};

/**
* | output |
* | --- |
* | "Next nap in {remaining} (at {at})" |
*
* @param {Wake_Timer_Next_Nap_InInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_next_nap_in = /** @type {((inputs: Wake_Timer_Next_Nap_InInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Next_Nap_InInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_next_nap_in(inputs)
	return en_wake_timer_next_nap_in(inputs)
});