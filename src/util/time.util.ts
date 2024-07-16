import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeUtil{
constructor(){}
    public async timeStringToDate(time: string): Promise<Date>{
        const date = new Date();
        const [hour, minute, second] = time.split(":").map(Number);
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(second);
        return date;
    }
}