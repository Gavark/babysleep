/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} History_TitleInputs */

const fr_history_title = /** @type {(inputs: History_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Historique — ${i?.name}`)
};

const en_history_title = /** @type {(inputs: History_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`History — ${i?.name}`)
};

/**
* | output |
* | --- |
* | "History — {name}" |
*
* @param {History_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_title = /** @type {((inputs: History_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_title(inputs)
	return en_history_title(inputs)
});