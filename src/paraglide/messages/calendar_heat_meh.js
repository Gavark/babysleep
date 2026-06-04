/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Heat_MehInputs */

const fr_calendar_heat_meh = /** @type {(inputs: Calendar_Heat_MehInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faible (50-70%)`)
};

const en_calendar_heat_meh = /** @type {(inputs: Calendar_Heat_MehInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Low (50-70%)`)
};

/**
* | output |
* | --- |
* | "Low (50-70%)" |
*
* @param {Calendar_Heat_MehInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_heat_meh = /** @type {((inputs?: Calendar_Heat_MehInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Heat_MehInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_heat_meh(inputs)
	return en_calendar_heat_meh(inputs)
});