/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Push_Payload_BodyInputs */

const fr_push_payload_body = /** @type {(inputs: Push_Payload_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Il est temps de commencer la prochaine sieste de ${i?.name}.`)
};

const en_push_payload_body = /** @type {(inputs: Push_Payload_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Time to start ${i?.name}'s next nap.`)
};

/**
* | output |
* | --- |
* | "Time to start {name}'s next nap." |
*
* @param {Push_Payload_BodyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const push_payload_body = /** @type {((inputs: Push_Payload_BodyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Push_Payload_BodyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_push_payload_body(inputs)
	return en_push_payload_body(inputs)
});