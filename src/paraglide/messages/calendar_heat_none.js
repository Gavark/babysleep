/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Heat_NoneInputs */

const fr_calendar_heat_none = /** @type {(inputs: Calendar_Heat_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune donnée`)
};

const en_calendar_heat_none = /** @type {(inputs: Calendar_Heat_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data`)
};

/**
* | output |
* | --- |
* | "No data" |
*
* @param {Calendar_Heat_NoneInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_heat_none = /** @type {((inputs?: Calendar_Heat_NoneInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Heat_NoneInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_heat_none(inputs)
	return en_calendar_heat_none(inputs)
});