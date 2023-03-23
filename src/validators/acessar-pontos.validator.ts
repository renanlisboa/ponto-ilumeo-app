import { z, Schema } from 'zod';

import { Validator } from './validator.contract';

export class AcessarPontosValidator implements Validator {
  private readonly schema: Schema;

  constructor() {
    this.schema = z.object({
      codigoColaborador: z.string().min(1).max(20),
    });
  }

  validate(body: any): any {
    return this.schema.parse(body);
  }
}
