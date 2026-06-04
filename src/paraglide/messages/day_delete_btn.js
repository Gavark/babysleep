/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Delete_BtnInputs */

const fr_day_delete_btn = /** @type {(inputs: Day_Delete_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cette journée`)
};

const en_day_delete_btn = /** @type {(inputs: Day_Delete_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this day`)
};

/**
* | output |
* | --- |
* | "Delete this day" |
*
* @param {Day_Delete_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_delete_btn = /** @type {((inputs?: Day_Delete_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Delete_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_delete_btn(inputs)
	return en_day_delete_btn(inputs)
});