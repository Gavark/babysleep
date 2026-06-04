/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Babies_List_Born_OnInputs */

const fr_babies_list_born_on = /** @type {(inputs: Babies_List_Born_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`né(e) le ${i?.date}`)
};

const en_babies_list_born_on = /** @type {(inputs: Babies_List_Born_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`born on ${i?.date}`)
};

/**
* | output |
* | --- |
* | "born on {date}" |
*
* @param {Babies_List_Born_OnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const babies_list_born_on = /** @type {((inputs: Babies_List_Born_OnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Babies_List_Born_OnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_babies_list_born_on(inputs)
	return en_babies_list_born_on(inputs)
});