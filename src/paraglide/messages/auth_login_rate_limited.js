/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Login_Rate_LimitedInputs */

const fr_auth_login_rate_limited = /** @type {(inputs: Auth_Login_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trop de tentatives pour ce compte. Réessaie dans 15 minutes.`)
};

const en_auth_login_rate_limited = /** @type {(inputs: Auth_Login_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Too many attempts for this account. Try again in 15 minutes.`)
};

/**
* | output |
* | --- |
* | "Too many attempts for this account. Try again in 15 minutes." |
*
* @param {Auth_Login_Rate_LimitedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_login_rate_limited = /** @type {((inputs?: Auth_Login_Rate_LimitedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Login_Rate_LimitedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_auth_login_rate_limited(inputs)
	return fr_auth_login_rate_limited(inputs)
});