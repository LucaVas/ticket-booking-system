// 2023-11-06 19:30:00
// date: '2023-11-06',
//    time: '21:15'

import BadRequest from './errors/BadRequest';

function parseToLocaleDateTimeString(date: string, time: string): string {
  try {
    const dateObj = new Date(`${date} ${time}`);
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  } catch (err) {
    throw new BadRequest(`Invalid date or time - ${date} ${time}`);
  }
}
