/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Btn_DisconnectInputs */

const fr_common_btn_disconnect = /** @type {(inputs: Common_Btn_DisconnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déconnecter`)
};

const en_common_btn_disconnect = /** @type {(inputs: Common_Btn_DisconnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disconnect`)
};

/**
* | output |
* | --- |
* | "Disconnect" |
*
* @param {Common_Btn_DisconnectInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const common_btn_disconnect = /** @type {((inputs?: Common_Btn_DisconnectInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Btn_DisconnectInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_btn_disconnect(inputs)
	return en_common_btn_disconnect(inputs)
});