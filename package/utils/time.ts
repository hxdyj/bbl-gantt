import dayjs from "dayjs"
export const FORMAT_FULL_TIME = 'YYYY-MM-DD hh:mm:ss:SSS'
export function getDurationStartTime(addSeconds?: number) {
	if (!addSeconds) return dayjs(0)
	return dayjs(0).add(addSeconds * 1000, 'millisecond')
}
