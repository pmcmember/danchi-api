export namespace FormatDateUtil {
    export type AllowedDelim = "/" | ":" | ''
}

/**
 * 日付の整形を行うUtilクラス
 */
export class FormatDateUtil {

    /**
     * yyyy/MM/dd形式の日付文字列を返却する
     * @param date 日付を指定(未設定時は現在日を設定)
     * @param dateDelim 出力する日付の区切り文字
     * @returns yyyy/MM/dd形式の日付文字列
     */
    public static getDate = (date: Date = new Date(), dateDelim: FormatDateUtil.AllowedDelim = "/"): string => {
        FormatDateUtil.inspectionDateFormat(date);
        return date.getFullYear() + dateDelim
            + FormatDateUtil.toDoubleDigit(date.getMonth() + 1) + dateDelim
            + FormatDateUtil.toDoubleDigit(date.getDate());
    }

    /**
     * hh:mm:ss形式の時刻文字列を返却する
     * @param time 時刻を指定(未設定時は現在時刻を設定)
     * @param timeDelim 出力する時間の区切り文字
     * @returns 
     */
    public static getTime = (time: Date = new Date(), timeDelim: FormatDateUtil.AllowedDelim = ":"): string => {
        FormatDateUtil.inspectionDateFormat(time);
        return FormatDateUtil.toDoubleDigit(time.getHours()) + timeDelim
            + FormatDateUtil.toDoubleDigit(time.getMinutes()) + timeDelim
            + FormatDateUtil.toDoubleDigit(time.getSeconds());
    }

    /**
     * yyyy/MM/dd HH:mm:ss形式の日時文字列を返却する
     * @param dateTime 日時を指定(未設定時は現在日時を設定)
     * @param dateDelim 出力する日付の区切り文字
     * @param timeDelim 出力する時間の区切り文字
     * @returns  yyyy/MM/dd HH:mm:ss形式の日時文字列
     */
    public static getDateTime = (dateTime: Date = new Date(), dateDelim?: FormatDateUtil.AllowedDelim, timeDelim?: FormatDateUtil.AllowedDelim): string => {
        FormatDateUtil.inspectionDateFormat(dateTime);
        return FormatDateUtil.getDate(dateTime, dateDelim) + " " + FormatDateUtil.getTime(dateTime, timeDelim);
    }

    /**
     * 二桁まで0埋めした数値文字列を返却する
     * @param src 変換元の値
     * @returns 2桁まで0埋めした数値文字列
     */
    private static toDoubleDigit = (src: number | string): string => {
        const strDate = src.toString();
        return (strDate.length !== 2 ? ("0" + strDate) : strDate);
    }

    /**
     * Date型引数に不正な値が設定されていないか検証する
     * @param src 日付情報
     * @throws Error 不正な日付情報の際にThrow
     */
    private static inspectionDateFormat = (src: Date): void => {
        if (src.toString() === "Invalid Date") throw new Error("[ERROR] passed 'Invalid Date'.");
    }
}