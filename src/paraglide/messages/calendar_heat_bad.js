/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Heat_BadInputs */

const fr_calendar_heat_bad = /** @type {(inputs: Calendar_Heat_BadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Très faible (< 50%)`)
};

const en_calendar_heat_bad = /** @type {(inputs: Calendar_Heat_BadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Very low (< 50%)`)
};

/**
* | output |
* | --- |
* | "Very low (< 50%)" |
*
* @param {Calendar_Heat_BadInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_heat_bad = /** @type {((inputs?: Calendar_Heat_BadInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Heat_BadInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_heat_bad(inputs)
	return en_calendar_heat_bad(inputs)
});