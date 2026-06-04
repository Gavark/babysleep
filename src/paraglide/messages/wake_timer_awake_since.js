/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Awake_SinceInputs */

const fr_wake_timer_awake_since = /** @type {(inputs: Wake_Timer_Awake_SinceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Éveillé depuis`)
};

const en_wake_timer_awake_since = /** @type {(inputs: Wake_Timer_Awake_SinceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awake for`)
};

/**
* | output |
* | --- |
* | "Awake for" |
*
* @param {Wake_Timer_Awake_SinceInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_awake_since = /** @type {((inputs?: Wake_Timer_Awake_SinceInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Awake_SinceInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_awake_since(inputs)
	return en_wake_timer_awake_since(inputs)
});