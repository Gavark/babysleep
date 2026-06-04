/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Heat_PartialInputs */

const fr_calendar_heat_partial = /** @type {(inputs: Calendar_Heat_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Journée incomplète (…)`)
};

const en_calendar_heat_partial = /** @type {(inputs: Calendar_Heat_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Incomplete day (…)`)
};

/**
* | output |
* | --- |
* | "Incomplete day (…)" |
*
* @param {Calendar_Heat_PartialInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_heat_partial = /** @type {((inputs?: Calendar_Heat_PartialInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Heat_PartialInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_heat_partial(inputs)
	return en_calendar_heat_partial(inputs)
});