/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Picker_Edit_DayInputs */

const fr_calendar_picker_edit_day = /** @type {(inputs: Calendar_Picker_Edit_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Éditer la journée complète`)
};

const en_calendar_picker_edit_day = /** @type {(inputs: Calendar_Picker_Edit_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit full day`)
};

/**
* | output |
* | --- |
* | "Edit full day" |
*
* @param {Calendar_Picker_Edit_DayInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_picker_edit_day = /** @type {((inputs?: Calendar_Picker_Edit_DayInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Picker_Edit_DayInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_picker_edit_day(inputs)
	return en_calendar_picker_edit_day(inputs)
});