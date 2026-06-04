/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Aria_LabelInputs */

const fr_wake_timer_aria_label = /** @type {(inputs: Wake_Timer_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Timer fenêtre d'éveil`)
};

const en_wake_timer_aria_label = /** @type {(inputs: Wake_Timer_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awake window timer`)
};

/**
* | output |
* | --- |
* | "Awake window timer" |
*
* @param {Wake_Timer_Aria_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_aria_label = /** @type {((inputs?: Wake_Timer_Aria_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Aria_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_aria_label(inputs)
	return en_wake_timer_aria_label(inputs)
});