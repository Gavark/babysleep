/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_EmptyInputs */

const fr_history_empty = /** @type {(inputs: History_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune entrée sur cette période.`)
};

const en_history_empty = /** @type {(inputs: History_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No entries in this period.`)
};

/**
* | output |
* | --- |
* | "No entries in this period." |
*
* @param {History_EmptyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_empty = /** @type {((inputs?: History_EmptyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_EmptyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_empty(inputs)
	return en_history_empty(inputs)
});