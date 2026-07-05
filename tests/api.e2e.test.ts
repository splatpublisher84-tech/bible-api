import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

// E2E cho bản NestJS — thay bộ test Express cũ, giữ nguyên coverage (+ vài case parity).
// Cần Postgres local có dữ liệu (docker compose up).
let app: NestFastifyApplication;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
  configureApp(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

afterAll(async () => {
  await app.close();
});

const http = () => request(app.getHttpServer());

describe('GET /health & /', () => {
  it('/health returns OK', async () => {
    const res = await http().get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeDefined();
  });
  it('/ returns API info', async () => {
    const res = await http().get('/');
    expect(res.status).toBe(200);
    expect(res.body.version).toBe('1.0.0');
  });
});

describe('GET /api/translations', () => {
  it('returns array incl cadman', async () => {
    const res = await http().get('/api/translations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.map((t: { abbr: string }) => t.abbr)).toContain('cadman');
  });
  it(':abbr returns cadman with correct shape', async () => {
    const res = await http().get('/api/translations/cadman');
    expect(res.status).toBe(200);
    const { data } = res.body;
    expect(data.abbr).toBe('cadman');
    for (const k of ['name', 'language', 'is_public_domain', 'has_strongs']) {
      expect(data).toHaveProperty(k);
    }
  });
  it(':abbr 404 for nonexistent', async () => {
    const res = await http().get('/api/translations/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Translation not found');
  });
});

describe('GET /api/books', () => {
  it('66 books for cadman, first is Genesis', async () => {
    const res = await http().get('/api/books?translation=cadman');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(66);
    expect(res.body.data[0].id).toBe(1);
    expect(res.body.data[0].name).toBe('Sáng-thế Ký');
  });
  it('404 nonexistent translation', async () => {
    const res = await http().get('/api/books?translation=nonexistent');
    expect(res.status).toBe(404);
  });
  it('400 missing translation param', async () => {
    const res = await http().get('/api/books');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
  });
  it('chapters: 50 for Genesis (cadman)', async () => {
    const res = await http().get('/api/books/1/chapters?translation=cadman');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(50);
  });
  it('chapters: 400 invalid bookId 99', async () => {
    const res = await http().get('/api/books/99/chapters?translation=cadman');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/verses', () => {
  it('31 verses for Genesis 1 (cadman)', async () => {
    const res = await http().get('/api/verses/cadman/1/1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(31);
  });
  it('404 nonexistent translation / chapter', async () => {
    expect((await http().get('/api/verses/nonexistent/1/1')).status).toBe(404);
    expect((await http().get('/api/verses/cadman/1/999')).status).toBe(404);
  });
  it('Genesis 1:1 has text', async () => {
    const res = await http().get('/api/verses/cadman/1/1/1');
    expect(res.status).toBe(200);
    expect(res.body.data.verse).toBe(1);
    expect(res.body.data.text.length).toBeGreaterThan(0);
  });
  it('404 nonexistent verse', async () => {
    expect((await http().get('/api/verses/cadman/1/1/999')).status).toBe(404);
  });
});

describe('GET /api/search', () => {
  it('results + pagination', async () => {
    const res = await http().get('/api/search?q=God&translation=kjv_strongs&limit=3');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
    expect(res.body.pagination.total).toBeGreaterThan(0);
    expect(res.body.pagination.limit).toBe(3);
    expect(res.body.pagination.offset).toBe(0);
  });
  it('400 when q missing', async () => {
    expect((await http().get('/api/search?translation=cadman')).status).toBe(400);
  });
});

describe('GET /api/votd', () => {
  it('default today: full shape', async () => {
    const res = await http().get('/api/votd');
    expect(res.status).toBe(200);
    const { data } = res.body;
    for (const k of ['date', 'translation', 'reference', 'verses', 'theme', 'display_reference']) {
      expect(data).toHaveProperty(k);
    }
    expect(data.verses.length).toBeGreaterThan(0);
  });
  it('specific date + translation', async () => {
    const res = await http().get('/api/votd?date=2026-01-01&translation=cadman');
    expect(res.status).toBe(200);
    expect(res.body.data.date).toBe('2026-01-01');
    expect(res.body.data.translation).toBe('cadman');
  });
  it('deterministic for same date', async () => {
    const a = await http().get('/api/votd?date=2026-06-15&translation=kjv_strongs');
    const b = await http().get('/api/votd?date=2026-06-15&translation=kjv_strongs');
    expect(a.body.data.reference).toEqual(b.body.data.reference);
  });
  it('404 nonexistent translation, 400 bad date', async () => {
    expect((await http().get('/api/votd?translation=nonexistent')).status).toBe(404);
    expect((await http().get('/api/votd?date=not-a-date')).status).toBe(400);
  });
  it('Cache-Control 1 day', async () => {
    const res = await http().get('/api/votd?date=2026-01-01&translation=cadman');
    expect(res.headers['cache-control']).toBe('public, max-age=86400');
  });
});

describe('GET /api/status', () => {
  it('always 200 with api/database/data', async () => {
    const res = await http().get('/api/status');
    expect(res.status).toBe(200);
    expect(res.body.api.status).toBe('ok');
    expect(res.body.database.status).toBe('ok');
    expect(res.body.data.verses).toBeGreaterThan(0);
  });
});

describe('404 handler', () => {
  it('unknown route -> {error:"Not found"}', async () => {
    const res = await http().get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found');
  });
});
