/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ time: NonNullable<unknown> }} Wake_Timer_Bedtime_AtInputs */

const fr_wake_timer_bedtime_at = /** @type {(inputs: Wake_Timer_Bedtime_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Couché à ${i?.time} · bonne nuit 🌙`)
};

const en_wake_timer_bedtime_at = /** @type {(inputs: Wake_Timer_Bedtime_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bedtime at ${i?.time} · good night 🌙`)
};

/**
* | output |
* | --- |
* | "Bedtime at {time} · good night 🌙" |
*
* @param {Wake_Timer_Bedtime_AtInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_bedtime_at = /** @type {((inputs: Wake_Timer_Bedtime_AtInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Bedtime_AtInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_bedtime_at(inputs)
	return en_wake_timer_bedtime_at(inputs)
});