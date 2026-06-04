/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Wake_Timer_Napping_Pause_SuffixInputs */

const fr_wake_timer_napping_pause_suffix = /** @type {(inputs: Wake_Timer_Napping_Pause_SuffixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`dont ${i?.duration} de pause`)
};

const en_wake_timer_napping_pause_suffix = /** @type {(inputs: Wake_Timer_Napping_Pause_SuffixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`including ${i?.duration} of pause`)
};

/**
* | output |
* | --- |
* | "including {duration} of pause" |
*
* @param {Wake_Timer_Napping_Pause_SuffixInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_napping_pause_suffix = /** @type {((inputs: Wake_Timer_Napping_Pause_SuffixInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Napping_Pause_SuffixInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_napping_pause_suffix(inputs)
	return en_wake_timer_napping_pause_suffix(inputs)
});