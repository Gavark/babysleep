/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Notes_LabelInputs */

const fr_today_notes_label = /** @type {(inputs: Today_Notes_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

const en_today_notes_label = /** @type {(inputs: Today_Notes_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

/**
* | output |
* | --- |
* | "Notes" |
*
* @param {Today_Notes_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_notes_label = /** @type {((inputs?: Today_Notes_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Notes_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_notes_label(inputs)
	return en_today_notes_label(inputs)
});