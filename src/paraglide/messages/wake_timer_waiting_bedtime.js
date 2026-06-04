/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Waiting_BedtimeInputs */

const fr_wake_timer_waiting_bedtime = /** @type {(inputs: Wake_Timer_Waiting_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En attente du coucher`)
};

const en_wake_timer_waiting_bedtime = /** @type {(inputs: Wake_Timer_Waiting_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for bedtime`)
};

/**
* | output |
* | --- |
* | "Waiting for bedtime" |
*
* @param {Wake_Timer_Waiting_BedtimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_waiting_bedtime = /** @type {((inputs?: Wake_Timer_Waiting_BedtimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Waiting_BedtimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_waiting_bedtime(inputs)
	return en_wake_timer_waiting_bedtime(inputs)
});