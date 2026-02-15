import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/votd', () => {
  it('returns 200 with VOTD for today (default)', async () => {
    const res = await request(app).get('/api/votd');
    expect(res.status).toBe(200);
    const { data } = res.body;
    expect(data).toHaveProperty('date');
    expect(data).toHaveProperty('translation');
    expect(data).toHaveProperty('reference');
    expect(data).toHaveProperty('verses');
    expect(data).toHaveProperty('theme');
    expect(data).toHaveProperty('display_reference');
    expect(data.verses.length).toBeGreaterThan(0);
    expect(data.verses[0]).toHaveProperty('verse');
    expect(data.verses[0]).toHaveProperty('text');
  });

  it('returns 200 with specific date and translation', async () => {
    const res = await request(app).get('/api/votd?date=2026-01-01&translation=cadman');
    expect(res.status).toBe(200);
    const { data } = res.body;
    expect(data.date).toBe('2026-01-01');
    expect(data.translation).toBe('cadman');
    expect(data.reference.book_id).toBeGreaterThanOrEqual(1);
    expect(data.reference.book_id).toBeLessThanOrEqual(66);
  });

  it('returns same verse for same date (deterministic)', async () => {
    const res1 = await request(app).get('/api/votd?date=2026-06-15&translation=kjv_strongs');
    const res2 = await request(app).get('/api/votd?date=2026-06-15&translation=kjv_strongs');
    expect(res1.body.data.reference).toEqual(res2.body.data.reference);
  });

  it('returns different verses for different dates', async () => {
    const res1 = await request(app).get('/api/votd?date=2026-03-01&translation=kjv_strongs');
    const res2 = await request(app).get('/api/votd?date=2026-09-15&translation=kjv_strongs');
    // Very unlikely to be the same verse for two different dates
    const ref1 = res1.body.data.display_reference;
    const ref2 = res2.body.data.display_reference;
    expect(ref1 === ref2).toBe(false);
  });

  it('returns 404 for nonexistent translation', async () => {
    const res = await request(app).get('/api/votd?translation=nonexistent');
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid date format', async () => {
    const res = await request(app).get('/api/votd?date=not-a-date');
    expect(res.status).toBe(400);
  });

  it('has Cache-Control header set to 1 day', async () => {
    const res = await request(app).get('/api/votd');
    expect(res.headers['cache-control']).toBe('public, max-age=86400');
  });
});
