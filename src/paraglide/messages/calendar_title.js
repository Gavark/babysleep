/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Calendar_TitleInputs */

const fr_calendar_title = /** @type {(inputs: Calendar_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Calendrier — ${i?.name}`)
};

const en_calendar_title = /** @type {(inputs: Calendar_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Calendar — ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Calendar — {name}" |
*
* @param {Calendar_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_title = /** @type {((inputs: Calendar_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_title(inputs)
	return en_calendar_title(inputs)
});