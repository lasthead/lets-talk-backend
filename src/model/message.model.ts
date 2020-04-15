import {UserModel} from './user.model';

export class MessageModel {
  constructor(public from: UserModel, public content: string) {}
}
