/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Status_PendingInputs */

const fr_admin_invitations_status_pending = /** @type {(inputs: Admin_Invitations_Status_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`en attente`)
};

const en_admin_invitations_status_pending = /** @type {(inputs: Admin_Invitations_Status_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`pending`)
};

/**
* | output |
* | --- |
* | "pending" |
*
* @param {Admin_Invitations_Status_PendingInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_status_pending = /** @type {((inputs?: Admin_Invitations_Status_PendingInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Status_PendingInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_status_pending(inputs)
	return en_admin_invitations_status_pending(inputs)
});