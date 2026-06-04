/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Picker_Opt_GoodInputs */

const fr_calendar_picker_opt_good = /** @type {(inputs: Calendar_Picker_Opt_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bonne`)
};

const en_calendar_picker_opt_good = /** @type {(inputs: Calendar_Picker_Opt_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Good`)
};

/**
* | output |
* | --- |
* | "Good" |
*
* @param {Calendar_Picker_Opt_GoodInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_picker_opt_good = /** @type {((inputs?: Calendar_Picker_Opt_GoodInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Picker_Opt_GoodInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_picker_opt_good(inputs)
	return en_calendar_picker_opt_good(inputs)
});