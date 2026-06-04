/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Delete_ConfirmInputs */

const fr_day_delete_confirm = /** @type {(inputs: Day_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer définitivement cette journée ?`)
};

const en_day_delete_confirm = /** @type {(inputs: Day_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Permanently delete this day?`)
};

/**
* | output |
* | --- |
* | "Permanently delete this day?" |
*
* @param {Day_Delete_ConfirmInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_delete_confirm = /** @type {((inputs?: Day_Delete_ConfirmInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Delete_ConfirmInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_delete_confirm(inputs)
	return en_day_delete_confirm(inputs)
});