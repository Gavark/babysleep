/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Age_Rules_IntroInputs */

const fr_age_rules_intro = /** @type {(inputs: Age_Rules_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Les suggestions de BabySleep (nombre de siestes, fenêtres d'éveil, durées de sommeil) sont basées sur ce modèle. La ligne mise en avant correspond à l'âge actuel de ${i?.name}.`)
};

const en_age_rules_intro = /** @type {(inputs: Age_Rules_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`BabySleep's suggestions (nap count, awake windows, sleep durations) come from this model. The highlighted row matches ${i?.name}'s current age.`)
};

/**
* | output |
* | --- |
* | "BabySleep's suggestions (nap count, awake windows, sleep durations) come from this model. The highlighted row matches {name}'s current age." |
*
* @param {Age_Rules_IntroInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const age_rules_intro = /** @type {((inputs: Age_Rules_IntroInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Age_Rules_IntroInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_age_rules_intro(inputs)
	return en_age_rules_intro(inputs)
});