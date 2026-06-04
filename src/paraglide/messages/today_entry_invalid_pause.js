/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ field: NonNullable<unknown>, value: NonNullable<unknown> }} Today_Entry_Invalid_PauseInputs */

const fr_today_entry_invalid_pause = /** @type {(inputs: Today_Entry_Invalid_PauseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Pause invalide (${i?.field}) : ${i?.value}`)
};

const en_today_entry_invalid_pause = /** @type {(inputs: Today_Entry_Invalid_PauseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invalid pause (${i?.field}): ${i?.value}`)
};

/**
* | output |
* | --- |
* | "Invalid pause ({field}): {value}" |
*
* @param {Today_Entry_Invalid_PauseInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_entry_invalid_pause = /** @type {((inputs: Today_Entry_Invalid_PauseInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Entry_Invalid_PauseInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_entry_invalid_pause(inputs)
	return en_today_entry_invalid_pause(inputs)
});