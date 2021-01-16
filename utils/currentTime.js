import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

export const currentTime = dayjs().utc().format('YYYY-MM-DDTHH:mm:ssZ');