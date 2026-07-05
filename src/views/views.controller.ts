import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply } from 'fastify';

// /demo và /dashboard: phục vụ HTML với CSP riêng (port serveWithNonce/serveDashboard cũ).
// File .html được copy sang dist/views khi build (nest-cli assets).
@Controller()
export class ViewsController {
  constructor(private readonly config: ConfigService) {}

  @Get('demo')
  demo(@Res() reply: FastifyReply) {
    const nonce = randomBytes(16).toString('base64');
    reply.header(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; connect-src 'self'`
    );
    const html = readFileSync(join(__dirname, 'demo.html'), 'utf-8').replace(
      /<script>/g,
      `<script nonce="${nonce}">`
    );
    reply.type('text/html').send(html);
  }

  @Get('dashboard')
  dashboard(@Res() reply: FastifyReply) {
    reply.header(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; connect-src 'self'`
    );
    let html = readFileSync(join(__dirname, 'dashboard.html'), 'utf-8');
    const key = this.config.get<string>('METRICS_KEY');
    if (key) {
      html = html.replace('</head>', `<meta name="metrics-key" content="${key}">\n</head>`);
    }
    reply.type('text/html').send(html);
  }
}
