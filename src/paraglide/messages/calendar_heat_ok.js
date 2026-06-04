/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Heat_OkInputs */

const fr_calendar_heat_ok = /** @type {(inputs: Calendar_Heat_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Correct (70-90%)`)
};

const en_calendar_heat_ok = /** @type {(inputs: Calendar_Heat_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`OK (70-90%)`)
};

/**
* | output |
* | --- |
* | "OK (70-90%)" |
*
* @param {Calendar_Heat_OkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_heat_ok = /** @type {((inputs?: Calendar_Heat_OkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Heat_OkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_heat_ok(inputs)
	return en_calendar_heat_ok(inputs)
});