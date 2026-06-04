/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Month_PreviousInputs */

const fr_calendar_month_previous = /** @type {(inputs: Calendar_Month_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois précédent`)
};

const en_calendar_month_previous = /** @type {(inputs: Calendar_Month_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous month`)
};

/**
* | output |
* | --- |
* | "Previous month" |
*
* @param {Calendar_Month_PreviousInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_month_previous = /** @type {((inputs?: Calendar_Month_PreviousInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Month_PreviousInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_month_previous(inputs)
	return en_calendar_month_previous(inputs)
});