/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ field: NonNullable<unknown>, value: NonNullable<unknown> }} Day_Entry_Invalid_TimeInputs */

const fr_day_entry_invalid_time = /** @type {(inputs: Day_Entry_Invalid_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Heure invalide (${i?.field}) : ${i?.value}`)
};

const en_day_entry_invalid_time = /** @type {(inputs: Day_Entry_Invalid_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invalid time (${i?.field}): ${i?.value}`)
};

/**
* | output |
* | --- |
* | "Invalid time ({field}): {value}" |
*
* @param {Day_Entry_Invalid_TimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_entry_invalid_time = /** @type {((inputs: Day_Entry_Invalid_TimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Entry_Invalid_TimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_entry_invalid_time(inputs)
	return en_day_entry_invalid_time(inputs)
});