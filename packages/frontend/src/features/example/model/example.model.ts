export interface ExampleJson {
  id: number;
}

export class Example {
  id: number;

  constructor(data: Example) {
    this.id = data.id;
  }

  static fromJson(json: ExampleJson): Example {
    return new Example({
      id: json.id,
    });
  }
}
