import {success} from './private/logging';

export class FreshBreadToolkit {

  public hello(): void {
    success('hello world');
  }

  public async login(): Promise<boolean> {

  }
}