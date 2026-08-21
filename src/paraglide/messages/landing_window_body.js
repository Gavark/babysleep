/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Window_BodyInputs */

const fr_landing_window_body = /** @type {(inputs: Landing_Window_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un bébé de cinq mois tient environ deux heures entre deux siestes. Passé ce délai, l'endormissement devient plus difficile. BabySleep connaît ces durées par tranche d'âge et décompte celle en cours.`)
};

const en_landing_window_body = /** @type {(inputs: Landing_Window_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A five-month-old lasts about two hours between naps. Past that, falling asleep gets harder. BabySleep knows these durations per age bracket and counts down the current one.`)
};

/**
* | output |
* | --- |
* | "A five-month-old lasts about two hours between naps. Past that, falling asleep gets harder. BabySleep knows these durations per age bracket and counts down t..." |
*
* @param {Landing_Window_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_window_body = /** @type {((inputs?: Landing_Window_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Window_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_window_body(inputs)
	return en_landing_window_body(inputs)
});