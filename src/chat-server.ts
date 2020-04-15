import { createServer, Server } from 'http';
import express from "express";
import SocketIO from "socket.io";
import cors from "cors";
import { MessageModel, UserModel } from "./model";

export class ChatServer {
  public static readonly PORT:number = 8000;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private users: object[] = [];

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
    this.app.use(cors());
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || ChatServer.PORT;
  }

  private sockets(): void {
    this.io = require("socket.io").listen(this.server, { origins: '*:*'});
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      socket.on('message', (m: MessageModel) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });
      socket.on('user_joined', (u: UserModel) => {
        const user: UserModel = Object.assign({}, u);
        user.socketId = socket.id;
        this.users.push(user);
        console.log('[server](joined): %s', user.name);
        this.io.emit('user_joined', u);
      });
      socket.on('disconnect', () => {
        const disonnectedUser: UserModel = this.users.find(o => o.socketId === socket.id);
        console.log(this.users);
        console.log(disonnectedUser.name);
        this.io.emit('user_disconnected', disonnectedUser);
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
