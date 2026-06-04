/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ field: NonNullable<unknown>, value: NonNullable<unknown> }} Day_Entry_Invalid_PauseInputs */

const fr_day_entry_invalid_pause = /** @type {(inputs: Day_Entry_Invalid_PauseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Pause invalide (${i?.field}) : ${i?.value}`)
};

const en_day_entry_invalid_pause = /** @type {(inputs: Day_Entry_Invalid_PauseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invalid pause (${i?.field}): ${i?.value}`)
};

/**
* | output |
* | --- |
* | "Invalid pause ({field}): {value}" |
*
* @param {Day_Entry_Invalid_PauseInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_entry_invalid_pause = /** @type {((inputs: Day_Entry_Invalid_PauseInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Entry_Invalid_PauseInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_entry_invalid_pause(inputs)
	return en_day_entry_invalid_pause(inputs)
});