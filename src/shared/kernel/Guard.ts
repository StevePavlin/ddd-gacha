import {Operation} from "./Operation";

export class Guard {

    static againstIllegal(values: any) {
        let results: Operation<any>[] = [];


        Object.keys(values).map((key: any) => {
            const value = values[key];
            if (value === null || value === undefined || value === '') {
                results.push(
                    Operation.fail(`Illegal value specified for ${key}: ${value}`)
                )
            } else {
                results.push(
                    Operation.ok()
                )
            }
        });

        return Operation.combine(results);
    }

    static assertStringIsAtLeast(value: string, length: number) {
        return value.length >= length ?
            Operation.ok() : Operation.fail(`Length of string "${value}" is less than ${length}`)
    }

    static assertStringIsAtMost(value: string, length: number) {
        return value.length <= length ?
            Operation.ok() : Operation.fail(`Length of string "${value}" is greater than ${length}`)
    }
}