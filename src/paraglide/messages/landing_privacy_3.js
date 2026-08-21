/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Privacy_3Inputs */

const fr_landing_privacy_3 = /** @type {(inputs: Landing_Privacy_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mots de passe hachés en argon2id, sessions stockées en base.`)
};

const en_landing_privacy_3 = /** @type {(inputs: Landing_Privacy_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Passwords hashed with argon2id, sessions stored in the database.`)
};

/**
* | output |
* | --- |
* | "Passwords hashed with argon2id, sessions stored in the database." |
*
* @param {Landing_Privacy_3Inputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_privacy_3 = /** @type {((inputs?: Landing_Privacy_3Inputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Privacy_3Inputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_privacy_3(inputs)
	return en_landing_privacy_3(inputs)
});