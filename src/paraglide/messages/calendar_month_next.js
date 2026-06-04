/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Month_NextInputs */

const fr_calendar_month_next = /** @type {(inputs: Calendar_Month_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois suivant`)
};

const en_calendar_month_next = /** @type {(inputs: Calendar_Month_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next month`)
};

/**
* | output |
* | --- |
* | "Next month" |
*
* @param {Calendar_Month_NextInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_month_next = /** @type {((inputs?: Calendar_Month_NextInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Month_NextInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_month_next(inputs)
	return en_calendar_month_next(inputs)
});