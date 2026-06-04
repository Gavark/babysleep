/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Picker_Opt_MediumInputs */

const fr_calendar_picker_opt_medium = /** @type {(inputs: Calendar_Picker_Opt_MediumInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moyenne`)
};

const en_calendar_picker_opt_medium = /** @type {(inputs: Calendar_Picker_Opt_MediumInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average`)
};

/**
* | output |
* | --- |
* | "Average" |
*
* @param {Calendar_Picker_Opt_MediumInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_picker_opt_medium = /** @type {((inputs?: Calendar_Picker_Opt_MediumInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Picker_Opt_MediumInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_picker_opt_medium(inputs)
	return en_calendar_picker_opt_medium(inputs)
});