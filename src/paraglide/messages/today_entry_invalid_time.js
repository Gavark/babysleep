/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ field: NonNullable<unknown>, value: NonNullable<unknown> }} Today_Entry_Invalid_TimeInputs */

const fr_today_entry_invalid_time = /** @type {(inputs: Today_Entry_Invalid_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Heure invalide (${i?.field}) : ${i?.value}`)
};

const en_today_entry_invalid_time = /** @type {(inputs: Today_Entry_Invalid_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invalid time (${i?.field}): ${i?.value}`)
};

/**
* | output |
* | --- |
* | "Invalid time ({field}): {value}" |
*
* @param {Today_Entry_Invalid_TimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_entry_invalid_time = /** @type {((inputs: Today_Entry_Invalid_TimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Entry_Invalid_TimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_entry_invalid_time(inputs)
	return en_today_entry_invalid_time(inputs)
});