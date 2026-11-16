/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ tz: NonNullable<unknown> }} Today_Tz_RowInputs */

const fr_today_tz_row = /** @type {(inputs: Today_Tz_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fuseau : ${i?.tz}`)
};

const en_today_tz_row = /** @type {(inputs: Today_Tz_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Time zone: ${i?.tz}`)
};

/**
* | output |
* | --- |
* | "Time zone: {tz}" |
*
* @param {Today_Tz_RowInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_tz_row = /** @type {((inputs: Today_Tz_RowInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Tz_RowInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_tz_row(inputs)
	return fr_today_tz_row(inputs)
});