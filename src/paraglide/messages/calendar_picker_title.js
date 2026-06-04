/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Picker_TitleInputs */

const fr_calendar_picker_title = /** @type {(inputs: Calendar_Picker_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note de la nuit`)
};

const en_calendar_picker_title = /** @type {(inputs: Calendar_Picker_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Night rating`)
};

/**
* | output |
* | --- |
* | "Night rating" |
*
* @param {Calendar_Picker_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_picker_title = /** @type {((inputs?: Calendar_Picker_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Picker_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_picker_title(inputs)
	return en_calendar_picker_title(inputs)
});