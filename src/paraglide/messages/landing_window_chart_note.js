/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Window_Chart_NoteInputs */

const fr_landing_window_chart_note = /** @type {(inputs: Landing_Window_Chart_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valeurs par défaut, modifiables bébé par bébé depuis la page Modèle d'âge.`)
};

const en_landing_window_chart_note = /** @type {(inputs: Landing_Window_Chart_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defaults, editable per baby from the Age model page.`)
};

/**
* | output |
* | --- |
* | "Defaults, editable per baby from the Age model page." |
*
* @param {Landing_Window_Chart_NoteInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_window_chart_note = /** @type {((inputs?: Landing_Window_Chart_NoteInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Window_Chart_NoteInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_window_chart_note(inputs)
	return en_landing_window_chart_note(inputs)
});