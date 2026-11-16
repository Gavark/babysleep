/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Calendar_Week_OfInputs */

const fr_calendar_week_of = /** @type {(inputs: Calendar_Week_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Semaine du ${i?.date}`)
};

const en_calendar_week_of = /** @type {(inputs: Calendar_Week_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Week of ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Week of {date}" |
*
* @param {Calendar_Week_OfInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_week_of = /** @type {((inputs: Calendar_Week_OfInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Week_OfInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_week_of(inputs)
	return fr_calendar_week_of(inputs)
});