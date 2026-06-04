/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_SavedInputs */

const fr_day_saved = /** @type {(inputs: Day_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Journée mise à jour.`)
};

const en_day_saved = /** @type {(inputs: Day_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day updated.`)
};

/**
* | output |
* | --- |
* | "Day updated." |
*
* @param {Day_SavedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_saved = /** @type {((inputs?: Day_SavedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_SavedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_saved(inputs)
	return en_day_saved(inputs)
});