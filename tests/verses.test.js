import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/verses/:translation/:book/:chapter', () => {
  it('returns 200 with 31 verses for Genesis 1 (cadman)', async () => {
    const res = await request(app).get('/api/verses/cadman/1/1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(31);
  });

  it('returns 404 for nonexistent translation', async () => {
    const res = await request(app).get('/api/verses/nonexistent/1/1');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('returns 404 for nonexistent chapter', async () => {
    const res = await request(app).get('/api/verses/cadman/1/999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/verses/:translation/:book/:chapter/:verse', () => {
  it('returns 200 with Genesis 1:1 text', async () => {
    const res = await request(app).get('/api/verses/cadman/1/1/1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('verse', 1);
    expect(res.body.data).toHaveProperty('text');
    expect(res.body.data.text.length).toBeGreaterThan(0);
  });

  it('returns 404 for nonexistent verse', async () => {
    const res = await request(app).get('/api/verses/cadman/1/1/999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/search', () => {
  it('returns 200 with search results and pagination', async () => {
    const res = await request(app).get('/api/search?q=God&translation=kjv_strongs&limit=3');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination.total).toBeGreaterThan(0);
    expect(res.body.pagination).toHaveProperty('limit', 3);
    expect(res.body.pagination).toHaveProperty('offset', 0);
  });

  it('returns 400 when q is missing', async () => {
    const res = await request(app).get('/api/search?translation=cadman');
    expect(res.status).toBe(400);
  });
});
