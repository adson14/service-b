import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload,Ctx,RmqContext } from '@nestjs/microservices';
import { AuthService } from 'src/auth.service';
import { trace, context as otelContext, SpanContext, ROOT_CONTEXT, Span } from '@opentelemetry/api';
@Controller()
export class MensgaemController {
  private readonly logger = new Logger(MensgaemController.name);

  constructor(private authService: AuthService) {}

  @MessagePattern('message_b')
  async receiveMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    const tracer = trace.getTracer('service-b');
  
    // Cria um contexto de span pai a partir dos dados de trace recebidos
    const parentSpanContext: SpanContext = {
      traceId: data.traceId,
      spanId: data.spanId,
      traceFlags: 1,  // Define o nível de amostragem, se necessário
      isRemote: true,
    };
  
    // Define o contexto pai
    const parentContext = trace.setSpanContext(ROOT_CONTEXT, parentSpanContext);
  
    // Usa o contexto do trace para encapsular a criação do span
    return otelContext.with(parentContext, async () => {
      const span = tracer.startSpan('process_message_from_broker');
      try {
        const decodedToken = await this.authService.verifyToken(data.token);
        this.logger.log(`Message received: ${data.text}`);
        this.logger.log(`Token valid for user: ${decodedToken.userId}`);
  
        // Confirma a mensagem ao RabbitMQ
        context.getChannelRef().ack(context.getMessage());
        
        return { success: true, message: 'Message processed by Service B' };
      } catch (error) {
        span.recordException(error);
        this.logger.error('Invalid token!');
        return { success: false, message: 'Invalid token' };
      } finally {
        span.end();
      }
    });
  }
}
