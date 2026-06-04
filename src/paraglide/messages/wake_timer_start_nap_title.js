/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Wake_Timer_Start_Nap_TitleInputs */

const fr_wake_timer_start_nap_title = /** @type {(inputs: Wake_Timer_Start_Nap_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Démarrer une sieste maintenant`)
};

const en_wake_timer_start_nap_title = /** @type {(inputs: Wake_Timer_Start_Nap_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start a nap now`)
};

/**
* | output |
* | --- |
* | "Start a nap now" |
*
* @param {Wake_Timer_Start_Nap_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const wake_timer_start_nap_title = /** @type {((inputs?: Wake_Timer_Start_Nap_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Wake_Timer_Start_Nap_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_wake_timer_start_nap_title(inputs)
	return en_wake_timer_start_nap_title(inputs)
});