import { Either, Failure } from '../Lib/Library';

export interface CommandHandlerInterface {
  getSubject(): string;
  handle(msg: string): Promise<Either<Failure<any>, any>>;
}
