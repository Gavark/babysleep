/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ time: NonNullable<unknown> }} Today_Row_Upcoming_AtInputs */

const fr_today_row_upcoming_at = /** @type {(inputs: Today_Row_Upcoming_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`vers ${i?.time}`)
};

const en_today_row_upcoming_at = /** @type {(inputs: Today_Row_Upcoming_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`around ${i?.time}`)
};

/**
* | output |
* | --- |
* | "around {time}" |
*
* @param {Today_Row_Upcoming_AtInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_row_upcoming_at = /** @type {((inputs: Today_Row_Upcoming_AtInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Row_Upcoming_AtInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_row_upcoming_at(inputs)
	return fr_today_row_upcoming_at(inputs)
});