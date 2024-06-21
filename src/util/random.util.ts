import { Injectable } from "@nestjs/common";

@Injectable()
export class RandomUtil{
constructor(){}
    public async randomPassword(): Promise<string>{
        const numbers = "1234567890";
        const symbols = ".,?!@#$%*&";
        let chosen_numbers = "";
        for (let i = 0; i < 2; i++) {
            const random = Math.floor(Math.random() * numbers.length);
            chosen_numbers += numbers[random];
        }
        const chosen_symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const chosen = chosen_numbers + chosen_symbol;
        return chosen;
    }
}