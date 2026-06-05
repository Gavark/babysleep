/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Push_Payload_TitleInputs */

const fr_push_payload_title = /** @type {(inputs: Push_Payload_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} : fenêtre d'éveil dépassée`)
};

const en_push_payload_title = /** @type {(inputs: Push_Payload_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}: wake window exceeded`)
};

/**
* | output |
* | --- |
* | "{name}: wake window exceeded" |
*
* @param {Push_Payload_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const push_payload_title = /** @type {((inputs: Push_Payload_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Push_Payload_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_push_payload_title(inputs)
	return en_push_payload_title(inputs)
});