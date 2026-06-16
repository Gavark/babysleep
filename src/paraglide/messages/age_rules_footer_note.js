/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Age_Rules_Footer_NoteInputs */

const fr_age_rules_footer_note = /** @type {(inputs: Age_Rules_Footer_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce modèle est basé sur la littérature pédiatrique standard (Charlotte Mahé, Pediatric Sleep Council, Moms On Call). Chaque bébé est différent — utilisez ces valeurs comme repère, pas comme règle stricte.`)
};

const en_age_rules_footer_note = /** @type {(inputs: Age_Rules_Footer_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This model is based on standard pediatric literature (Charlotte Mahé, Pediatric Sleep Council, Moms On Call). Every baby is different — use these values as a guide, not a strict rule.`)
};

/**
* | output |
* | --- |
* | "This model is based on standard pediatric literature (Charlotte Mahé, Pediatric Sleep Council, Moms On Call). Every baby is different — use these values as a..." |
*
* @param {Age_Rules_Footer_NoteInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_footer_note = /** @type {((inputs?: Age_Rules_Footer_NoteInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_Footer_NoteInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_footer_note(inputs)
	return en_age_rules_footer_note(inputs)
});