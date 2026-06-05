/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notif_Page_MetaInputs */

const fr_notif_page_meta = /** @type {(inputs: Notif_Page_MetaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les appareils abonnés reçoivent une notification quand la fenêtre d'éveil d'un bébé est dépassée.`)
};

const en_notif_page_meta = /** @type {(inputs: Notif_Page_MetaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscribed devices receive a push when a baby's wake window expires.`)
};

/**
* | output |
* | --- |
* | "Subscribed devices receive a push when a baby's wake window expires." |
*
* @param {Notif_Page_MetaInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_page_meta = /** @type {((inputs?: Notif_Page_MetaInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Page_MetaInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_page_meta(inputs)
	return en_notif_page_meta(inputs)
});