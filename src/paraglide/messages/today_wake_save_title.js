/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Wake_Save_TitleInputs */

const fr_today_wake_save_title = /** @type {(inputs: Today_Wake_Save_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauvegarder le réveil`)
};

const en_today_wake_save_title = /** @type {(inputs: Today_Wake_Save_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save wake-up time`)
};

/**
* | output |
* | --- |
* | "Save wake-up time" |
*
* @param {Today_Wake_Save_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_wake_save_title = /** @type {((inputs?: Today_Wake_Save_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Wake_Save_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_wake_save_title(inputs)
	return en_today_wake_save_title(inputs)
});