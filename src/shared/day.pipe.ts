import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'day' })
export class DayPipe implements PipeTransform {
    transform(value: any): any {
        let now = new Date();
        let time = new Date(value);
        let diff = now.getDate() - time.getDate();
        if (diff == 0) {
            let hr = time.getHours();
            let min = time.getMinutes();
            let minStr = min > 9 ? min : '0' + min;
            if (hr == 0) {
                return '12:' + minStr + ' AM';
            }
            else if (hr == 12) {
                return '12:' + minStr + ' PM';
            }
            else if (hr > 12) {
                return (hr - 12) + ':' + minStr + ' PM';
            }
            return time.getHours() + ':' + minStr + ' AM';
        }
        else if (diff == 1) {
            return 'Yesterday';
        }
        else {
            return time.getDate() + '/' + time.getMonth() + '/' + time.getFullYear();
        }
    }
}