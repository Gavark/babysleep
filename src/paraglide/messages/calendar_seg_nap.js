/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Seg_NapInputs */

const fr_calendar_seg_nap = /** @type {(inputs: Calendar_Seg_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sieste`)
};

const en_calendar_seg_nap = /** @type {(inputs: Calendar_Seg_NapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nap`)
};

/**
* | output |
* | --- |
* | "Nap" |
*
* @param {Calendar_Seg_NapInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_seg_nap = /** @type {((inputs?: Calendar_Seg_NapInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Seg_NapInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_seg_nap(inputs)
	return en_calendar_seg_nap(inputs)
});