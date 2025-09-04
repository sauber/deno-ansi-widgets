abstract class Name {
  constructor(protected readonly name: string) {
  }
  public print(): void {
    console.log(this.name);
  }
  protected prepend(s: string): this {
    return this.create(s + " " + this.name);
  }

  public create(args: string): this {
    return new (this.constructor as new (name: string) => this)(args);
  }
}

class Title extends Name {
  title(s: string): Title {
    return this.prepend(s);
  }
}

// Expected output: Mrs. John
const person = new Title("John").title("Mr.");
person.print();
