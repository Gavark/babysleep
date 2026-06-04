/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ tz: NonNullable<unknown>, from: NonNullable<unknown>, to: NonNullable<unknown>, count: NonNullable<unknown> }} Stats_Period_InfoInputs */

const fr_stats_period_info = /** @type {(inputs: Stats_Period_InfoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fuseau : ${i?.tz} · Période : ${i?.from} → ${i?.to} · ${i?.count} jour(s)`)
};

const en_stats_period_info = /** @type {(inputs: Stats_Period_InfoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Time zone: ${i?.tz} · Period: ${i?.from} → ${i?.to} · ${i?.count} day(s)`)
};

/**
* | output |
* | --- |
* | "Time zone: {tz} · Period: {from} → {to} · {count} day(s)" |
*
* @param {Stats_Period_InfoInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_info = /** @type {((inputs: Stats_Period_InfoInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_InfoInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_info(inputs)
	return en_stats_period_info(inputs)
});