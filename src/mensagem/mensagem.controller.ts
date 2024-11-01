import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class MensgaemController {
  private readonly logger = new Logger(MensgaemController.name);

  constructor(private authService: AuthService) {}

  @MessagePattern('message_b')
  async receiveMessage(@Payload() data: any) {
    try {
      const decodedToken = await this.authService.verifyToken(data.token);
      this.logger.log(`Message received: ${data.text}`);
      this.logger.log(`Token valid for user: ${decodedToken.userId}`);
      return { success: true, message: 'Message processed by Service B' }; // Garante que uma resposta seja retornada
    } catch (error) {
      this.logger.error('Invalid token!');
      return { success: false, message: 'Invalid token' }; // Garante que uma resposta seja retornada

    }
  }
}
