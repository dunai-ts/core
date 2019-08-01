import { Accessor } from './Accessor';

export class CompleteAccessor<T> extends Accessor<T> {
    protected completed = false;

    constructor(value: T, protected callback: (value: T) => void) {
        super(value);
    }

    public complete(): void {
        if (this.completed)
            throw new Error('Accessor already completed');

        this.completed = true;

        this.callback(this.value);
    }
}
