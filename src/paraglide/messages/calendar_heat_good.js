/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Heat_GoodInputs */

const fr_calendar_heat_good = /** @type {(inputs: Calendar_Heat_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bon (≥ 90%)`)
};

const en_calendar_heat_good = /** @type {(inputs: Calendar_Heat_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Good (≥ 90%)`)
};

/**
* | output |
* | --- |
* | "Good (≥ 90%)" |
*
* @param {Calendar_Heat_GoodInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_heat_good = /** @type {((inputs?: Calendar_Heat_GoodInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Heat_GoodInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_heat_good(inputs)
	return en_calendar_heat_good(inputs)
});