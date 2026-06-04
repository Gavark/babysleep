/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Rate_Invalid_RatingInputs */

const fr_calendar_rate_invalid_rating = /** @type {(inputs: Calendar_Rate_Invalid_RatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note invalide`)
};

const en_calendar_rate_invalid_rating = /** @type {(inputs: Calendar_Rate_Invalid_RatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid rating`)
};

/**
* | output |
* | --- |
* | "Invalid rating" |
*
* @param {Calendar_Rate_Invalid_RatingInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_rate_invalid_rating = /** @type {((inputs?: Calendar_Rate_Invalid_RatingInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Rate_Invalid_RatingInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_rate_invalid_rating(inputs)
	return en_calendar_rate_invalid_rating(inputs)
});