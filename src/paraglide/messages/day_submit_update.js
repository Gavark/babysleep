/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Submit_UpdateInputs */

const fr_day_submit_update = /** @type {(inputs: Day_Submit_UpdateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mettre à jour la journée`)
};

const en_day_submit_update = /** @type {(inputs: Day_Submit_UpdateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Update day`)
};

/**
* | output |
* | --- |
* | "Update day" |
*
* @param {Day_Submit_UpdateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_submit_update = /** @type {((inputs?: Day_Submit_UpdateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Submit_UpdateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_submit_update(inputs)
	return en_day_submit_update(inputs)
});