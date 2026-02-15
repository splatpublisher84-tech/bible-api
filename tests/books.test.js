import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/books', () => {
  it('returns 200 with 66 books for cadman', async () => {
    const res = await request(app).get('/api/books?translation=cadman');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(66);
  });

  it('first book is Genesis (Sáng-thế Ký)', async () => {
    const res = await request(app).get('/api/books?translation=cadman');
    const first = res.body.data[0];
    expect(first.id).toBe(1);
    expect(first.name).toBe('Sáng-thế Ký');
  });

  it('returns 404 for nonexistent translation', async () => {
    const res = await request(app).get('/api/books?translation=nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('GET /api/books/:bookId/chapters', () => {
  it('returns 200 with 50 chapters for Genesis (cadman)', async () => {
    const res = await request(app).get('/api/books/1/chapters?translation=cadman');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(50);
  });

  it('returns 400 for invalid bookId (99)', async () => {
    const res = await request(app).get('/api/books/99/chapters?translation=cadman');
    expect(res.status).toBe(400);
  });
});
