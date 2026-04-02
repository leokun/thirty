import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return { status: 'ok' };
  }

  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
