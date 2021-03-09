/**
 * @since 0.5.0
 */
import * as t from 'io-ts'
import { pipe } from 'fp-ts/function'
import { chain } from 'fp-ts/Either'

/**
 * @since 0.5.0
 */
export type DateFromUnixTimeC = t.Type<Date, number>

/**
 * @example
 * import { DateFromUnixTime } from 'io-ts-types/lib/DateFromUnixTime'
 * import { right } from 'fp-ts/lib/Either'
 *
 * const date = new Date(1973, 10, 30)
 * const input = date.getTime() / 1000
 * assert.deepStrictEqual(DateFromUnixTime.decode(input), right(date))
 *
 * @since 0.5.0
 */
export const DateFromUnixTime: DateFromUnixTimeC = new t.Type<
    Date,
    number,
    unknown
>(
    'DateFromUnixTime',
    (u): u is Date => u instanceof Date,
    (u, c) =>
        pipe(
            // NOTE: here is the sole difference from stock io-ts-types
            // DateFromUnixTime: Kraken sends a non-integer number
            t.number.validate(u, c),
            chain((n) => {
                const d = new Date(n * 1000)
                return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d)
            }),
        ),
    (a) => a.getTime() / 1000,
)
