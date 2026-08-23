import { test, expect } from '@playwright/test';

interface TransactionResponse {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  channel?: 'mobile' | 'web' | 'atm';
}

test('latihan api testing sederhana', async () => {
  const response = {
    json: async () => ({
      id: 'tx-001',
      amount: 10000,
      status: 'completed',
      channel: 'mobile',
    }) as TransactionResponse,
  };

  const tx = (await response.json()) as TransactionResponse;

  expect(tx.status).toBe('completed');
  expect(tx.channel?.toUpperCase()).toBe('MOBILE');
});
