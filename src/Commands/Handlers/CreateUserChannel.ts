import Manager from '../../Bot/Manager';
import { CommandHandlerInterface } from '../CommandHandlerInterface';
import { Either, Failure } from '../../Lib/Library';
import { CreateUserChannelAction } from '../../Bot/Action/UserChannel/CreateUserChannelAction';

export class CreateUserChannelHandler implements CommandHandlerInterface {
  static subject = 'bot.server.*.channel.create';

  constructor(private manager: Manager) {}

  getSubject(): string {
    return CreateUserChannelHandler.subject;
  }

  handle(msg: any): Promise<Either<Failure<any>, any>> {
    return new CreateUserChannelAction(
      this.manager.logger,
      this.manager.bot,
      msg
    ).execute();
  }
}
