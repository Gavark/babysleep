/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ added: NonNullable<unknown>, seen: NonNullable<unknown> }} Notif_Device_Added_Last_SeenInputs */

const fr_notif_device_added_last_seen = /** @type {(inputs: Notif_Device_Added_Last_SeenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ajouté le ${i?.added} · vu pour la dernière fois le ${i?.seen}`)
};

const en_notif_device_added_last_seen = /** @type {(inputs: Notif_Device_Added_Last_SeenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Added ${i?.added} · last seen ${i?.seen}`)
};

/**
* | output |
* | --- |
* | "Added {added} · last seen {seen}" |
*
* @param {Notif_Device_Added_Last_SeenInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const notif_device_added_last_seen = /** @type {((inputs: Notif_Device_Added_Last_SeenInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notif_Device_Added_Last_SeenInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notif_device_added_last_seen(inputs)
	return en_notif_device_added_last_seen(inputs)
});