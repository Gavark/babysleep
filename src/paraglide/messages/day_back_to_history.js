/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Back_To_HistoryInputs */

const fr_day_back_to_history = /** @type {(inputs: Day_Back_To_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Historique`)
};

const en_day_back_to_history = /** @type {(inputs: Day_Back_To_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`History`)
};

/**
* | output |
* | --- |
* | "History" |
*
* @param {Day_Back_To_HistoryInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_back_to_history = /** @type {((inputs?: Day_Back_To_HistoryInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Back_To_HistoryInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_back_to_history(inputs)
	return en_day_back_to_history(inputs)
});