/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Chart_Before_Bed_NoteInputs */

const fr_stats_chart_before_bed_note = /** @type {(inputs: Stats_Chart_Before_Bed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les jours où l'écart dépasse le double de la recommandation sont ignorés : une sieste n'a sans doute pas été saisie.`)
};

const en_stats_chart_before_bed_note = /** @type {(inputs: Stats_Chart_Before_Bed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Days where the gap exceeds twice the recommendation are left out: a nap was probably not logged.`)
};

/**
* | output |
* | --- |
* | "Days where the gap exceeds twice the recommendation are left out: a nap was probably not logged." |
*
* @param {Stats_Chart_Before_Bed_NoteInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_chart_before_bed_note = /** @type {((inputs?: Stats_Chart_Before_Bed_NoteInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Chart_Before_Bed_NoteInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_stats_chart_before_bed_note(inputs)
	return fr_stats_chart_before_bed_note(inputs)
});