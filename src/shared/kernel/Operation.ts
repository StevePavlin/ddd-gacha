export class Operation<T> {

    private constructor(
        public wasSuccessful: boolean,
        private data: T | undefined,
        private errorMessage: string | undefined
    ) {}

    getValue(): T {
        if (!this.wasSuccessful) {
            throw new Error('Cannot get data of a failed business operation')
        }
        return <T>this.data;
    }

    getError(): string {
        if (this.wasSuccessful) {
            throw new Error('Cannot get error of a successful business operation')
        }
        return <string>this.errorMessage;
    }


    static ok<T>(data?: T) {
        return new Operation<T>(true, data, undefined);
    }
    static fail<T>(message: string) {
        return new Operation<T>(false, undefined, message);
    }

    static combine(operations: Operation<any>[]): Operation<any> {
        let errors: string[] = [];

        for (let operation of operations) {
            if (!operation.wasSuccessful) {
                errors.push(operation.getError());
            } else {

            }
        }

        return errors.length > 0 ?
            Operation.fail(errors.join(', '))
            :
            Operation.ok();
    }
}