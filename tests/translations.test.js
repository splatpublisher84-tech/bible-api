import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/translations', () => {
  it('returns 200 with an array of translations', async () => {
    const res = await request(app).get('/api/translations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('includes known translations', async () => {
    const res = await request(app).get('/api/translations');
    const abbrs = res.body.data.map(t => t.abbr);
    expect(abbrs).toContain('cadman');
  });
});

describe('GET /api/translations/:abbr', () => {
  it('returns 200 with cadman translation data', async () => {
    const res = await request(app).get('/api/translations/cadman');
    expect(res.status).toBe(200);
    expect(res.body.data.abbr).toBe('cadman');
  });

  it('returns correct response shape', async () => {
    const res = await request(app).get('/api/translations/cadman');
    const { data } = res.body;
    expect(data).toHaveProperty('abbr');
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('language');
    expect(data).toHaveProperty('is_public_domain');
    expect(data).toHaveProperty('has_strongs');
  });

  it('returns 404 for nonexistent translation', async () => {
    const res = await request(app).get('/api/translations/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
