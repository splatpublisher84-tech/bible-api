import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { clientIpTracker } from './client-ip';

const ctx = {} as ExecutionContext; // getTracker không dùng tới context
const track = (headers: Record<string, string | string[] | undefined>, ip = '10.0.0.1') =>
  clientIpTracker({ headers, ip }, ctx);

describe('clientIpTracker', () => {
  it('ưu tiên Fly-Client-IP (IP client thật do Fly ghi)', () => {
    expect(track({ 'fly-client-ip': '203.0.113.7' })).toBe('203.0.113.7');
  });

  it('BỎ QUA X-Forwarded-For (client bịa được)', () => {
    expect(track({ 'x-forwarded-for': '1.2.3.4', 'fly-client-ip': '203.0.113.7' })).toBe(
      '203.0.113.7'
    );
  });

  it('CHỐNG spoof: client chèn Fly-Client-IP giả (chuỗi "giả, thật") → lấy giá trị sau cùng', () => {
    expect(track({ 'fly-client-ip': '1.2.3.4, 203.0.113.7' })).toBe('203.0.113.7');
  });

  it('CHỐNG spoof: dạng mảng → lấy phần tử cuối (proxy thêm)', () => {
    expect(track({ 'fly-client-ip': ['1.2.3.4', '203.0.113.7'] })).toBe('203.0.113.7');
  });

  it('fallback về req.ip khi thiếu Fly-Client-IP (local dev, không có proxy)', () => {
    expect(track({}, '127.0.0.1')).toBe('127.0.0.1');
  });
});
