import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

//return current time in UTC
export const currentTime = dayjs().utc().format('YYYY-MM-DDTHH:mm:ssZ');