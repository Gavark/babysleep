/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown>, date: NonNullable<unknown> }} Day_TitleInputs */

const fr_day_title = /** @type {(inputs: Day_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} — ${i?.date}`)
};

const en_day_title = /** @type {(inputs: Day_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} — ${i?.date}`)
};

/**
* | output |
* | --- |
* | "{name} — {date}" |
*
* @param {Day_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_title = /** @type {((inputs: Day_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_title(inputs)
	return en_day_title(inputs)
});