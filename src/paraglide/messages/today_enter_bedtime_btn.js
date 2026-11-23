/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Enter_Bedtime_BtnInputs */

const fr_today_enter_bedtime_btn = /** @type {(inputs: Today_Enter_Bedtime_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisir l'heure de coucher`)
};

const en_today_enter_bedtime_btn = /** @type {(inputs: Today_Enter_Bedtime_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter bedtime`)
};

/**
* | output |
* | --- |
* | "Enter bedtime" |
*
* @param {Today_Enter_Bedtime_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_enter_bedtime_btn = /** @type {((inputs?: Today_Enter_Bedtime_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Enter_Bedtime_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_enter_bedtime_btn(inputs)
	return fr_today_enter_bedtime_btn(inputs)
});