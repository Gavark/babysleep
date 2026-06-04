/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Picker_ClearInputs */

const fr_calendar_picker_clear = /** @type {(inputs: Calendar_Picker_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Effacer la note`)
};

const en_calendar_picker_clear = /** @type {(inputs: Calendar_Picker_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear rating`)
};

/**
* | output |
* | --- |
* | "Clear rating" |
*
* @param {Calendar_Picker_ClearInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_picker_clear = /** @type {((inputs?: Calendar_Picker_ClearInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Picker_ClearInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_picker_clear(inputs)
	return en_calendar_picker_clear(inputs)
});