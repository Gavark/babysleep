/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Seg_NightInputs */

const fr_calendar_seg_night = /** @type {(inputs: Calendar_Seg_NightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuit (00→lever et coucher→24)`)
};

const en_calendar_seg_night = /** @type {(inputs: Calendar_Seg_NightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Night (00→wake and bedtime→24)`)
};

/**
* | output |
* | --- |
* | "Night (00→wake and bedtime→24)" |
*
* @param {Calendar_Seg_NightInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_seg_night = /** @type {((inputs?: Calendar_Seg_NightInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Seg_NightInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_seg_night(inputs)
	return en_calendar_seg_night(inputs)
});