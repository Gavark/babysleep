/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ tz: NonNullable<unknown> }} Today_Tz_Inherit_OptionInputs */

const fr_today_tz_inherit_option = /** @type {(inputs: Today_Tz_Inherit_OptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Hériter (${i?.tz})`)
};

const en_today_tz_inherit_option = /** @type {(inputs: Today_Tz_Inherit_OptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Inherit (${i?.tz})`)
};

/**
* | output |
* | --- |
* | "Inherit ({tz})" |
*
* @param {Today_Tz_Inherit_OptionInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_tz_inherit_option = /** @type {((inputs: Today_Tz_Inherit_OptionInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Tz_Inherit_OptionInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_tz_inherit_option(inputs)
	return en_today_tz_inherit_option(inputs)
});