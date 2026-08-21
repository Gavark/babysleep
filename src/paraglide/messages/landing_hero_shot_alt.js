/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Hero_Shot_AltInputs */

const fr_landing_hero_shot_alt = /** @type {(inputs: Landing_Hero_Shot_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calendrier mensuel de BabySleep : une barre 24 h par jour, colorée selon le quota de sommeil atteint.`)
};

const en_landing_hero_shot_alt = /** @type {(inputs: Landing_Hero_Shot_AltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`BabySleep month calendar: one 24 h bar per day, coloured by how much of the sleep quota was reached.`)
};

/**
* | output |
* | --- |
* | "BabySleep month calendar: one 24 h bar per day, coloured by how much of the sleep quota was reached." |
*
* @param {Landing_Hero_Shot_AltInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_hero_shot_alt = /** @type {((inputs?: Landing_Hero_Shot_AltInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Hero_Shot_AltInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_hero_shot_alt(inputs)
	return en_landing_hero_shot_alt(inputs)
});