/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Picker_Opt_BadInputs */

const fr_calendar_picker_opt_bad = /** @type {(inputs: Calendar_Picker_Opt_BadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mauvaise`)
};

const en_calendar_picker_opt_bad = /** @type {(inputs: Calendar_Picker_Opt_BadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bad`)
};

/**
* | output |
* | --- |
* | "Bad" |
*
* @param {Calendar_Picker_Opt_BadInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_picker_opt_bad = /** @type {((inputs?: Calendar_Picker_Opt_BadInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Picker_Opt_BadInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_picker_opt_bad(inputs)
	return en_calendar_picker_opt_bad(inputs)
});