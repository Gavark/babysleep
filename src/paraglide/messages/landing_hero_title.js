/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Hero_TitleInputs */

const fr_landing_hero_title = /** @type {(inputs: Landing_Hero_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le sommeil de votre bébé, sur votre propre serveur.`)
};

const en_landing_hero_title = /** @type {(inputs: Landing_Hero_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your baby's sleep, on your own server.`)
};

/**
* | output |
* | --- |
* | "Your baby's sleep, on your own server." |
*
* @param {Landing_Hero_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_hero_title = /** @type {((inputs?: Landing_Hero_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Hero_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_hero_title(inputs)
	return en_landing_hero_title(inputs)
});