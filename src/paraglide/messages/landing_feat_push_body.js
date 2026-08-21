/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Feat_Push_BodyInputs */

const fr_landing_feat_push_body = /** @type {(inputs: Landing_Feat_Push_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications Web Push, activées appareil par appareil. Rien n'est envoyé sans votre accord.`)
};

const en_landing_feat_push_body = /** @type {(inputs: Landing_Feat_Push_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Web Push notifications, enabled device by device. Nothing is sent without your say-so.`)
};

/**
* | output |
* | --- |
* | "Web Push notifications, enabled device by device. Nothing is sent without your say-so." |
*
* @param {Landing_Feat_Push_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_feat_push_body = /** @type {((inputs?: Landing_Feat_Push_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Feat_Push_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_feat_push_body(inputs)
	return en_landing_feat_push_body(inputs)
});