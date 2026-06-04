/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Submit_Save_DayInputs */

const fr_today_submit_save_day = /** @type {(inputs: Today_Submit_Save_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer la journée`)
};

const en_today_submit_save_day = /** @type {(inputs: Today_Submit_Save_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save day`)
};

/**
* | output |
* | --- |
* | "Save day" |
*
* @param {Today_Submit_Save_DayInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_submit_save_day = /** @type {((inputs?: Today_Submit_Save_DayInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Submit_Save_DayInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_submit_save_day(inputs)
	return en_today_submit_save_day(inputs)
});