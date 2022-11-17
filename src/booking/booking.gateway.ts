import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { BookingService } from './booking.service';
import { BookingDto } from './dto';

@WebSocketGateway({ namespace: '/booking' })
export class BookingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(BookingGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly bookingService: BookingService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Client connected:', client.id);
   this.logger.log('Client connected:', client.handshake.headers);
  }
  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('create-new-booking')
  async handleMessage(
//    @MessageBody() bookingDto: BookingDto,
    @MessageBody() payload: any,
    @ConnectedSocket() socket: Socket,
  ) {
//    const cookie = socket.handshake.headers.cookie;
    const access_token = payload[1];
    if (access_token) {
      const userInfo = await this.authService.authenticate(access_token);
      const booking = await this.bookingService.createOne(payload[0], userInfo);      
      this.server.emit('create-new-booking', booking);
    } else {
      throw new UnauthorizedException();
    }
  }

  // @SubscribeMessage('message')
  // handleMessage(client: Socket, payload: string) {
  //   client.emit('message', payload);
  // }
}
