/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Pause_Cancel_LabelInputs */

const fr_wake_timer_pause_cancel_label = /** @type {(inputs: Wake_Timer_Pause_Cancel_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuler`)
};

const en_wake_timer_pause_cancel_label = /** @type {(inputs: Wake_Timer_Pause_Cancel_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancel`)
};

/**
* | output |
* | --- |
* | "Cancel" |
*
* @param {Wake_Timer_Pause_Cancel_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_pause_cancel_label = /** @type {((inputs?: Wake_Timer_Pause_Cancel_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Pause_Cancel_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_pause_cancel_label(inputs)
	return en_wake_timer_pause_cancel_label(inputs)
});