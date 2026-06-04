/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Submit_CreateInputs */

const fr_day_submit_create = /** @type {(inputs: Day_Submit_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer la journée`)
};

const en_day_submit_create = /** @type {(inputs: Day_Submit_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create day`)
};

/**
* | output |
* | --- |
* | "Create day" |
*
* @param {Day_Submit_CreateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_submit_create = /** @type {((inputs?: Day_Submit_CreateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Submit_CreateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_submit_create(inputs)
	return en_day_submit_create(inputs)
});