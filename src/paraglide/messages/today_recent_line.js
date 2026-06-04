/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ wake: NonNullable<unknown>, bedtime: NonNullable<unknown> }} Today_Recent_LineInputs */

const fr_today_recent_line = /** @type {(inputs: Today_Recent_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`réveil ${i?.wake} / coucher ${i?.bedtime}`)
};

const en_today_recent_line = /** @type {(inputs: Today_Recent_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`wake ${i?.wake} / bedtime ${i?.bedtime}`)
};

/**
* | output |
* | --- |
* | "wake {wake} / bedtime {bedtime}" |
*
* @param {Today_Recent_LineInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_recent_line = /** @type {((inputs: Today_Recent_LineInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Recent_LineInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_recent_line(inputs)
	return en_today_recent_line(inputs)
});