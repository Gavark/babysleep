/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_EmptyInputs */

const fr_wake_timer_empty = /** @type {(inputs: Wake_Timer_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisis l'heure de réveil pour démarrer le suivi.`)
};

const en_wake_timer_empty = /** @type {(inputs: Wake_Timer_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the wake-up time to start tracking.`)
};

/**
* | output |
* | --- |
* | "Enter the wake-up time to start tracking." |
*
* @param {Wake_Timer_EmptyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_empty = /** @type {((inputs?: Wake_Timer_EmptyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_EmptyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_empty(inputs)
	return en_wake_timer_empty(inputs)
});