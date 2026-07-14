import { expect, test } from '@playwright/test';

test('accesso demo e navigazione operativa', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Accedi alla tua officina' })).toBeVisible();
  await page.getByRole('button', { name: 'Entra nella demo' }).click();
  await expect(page.getByRole('heading', { name: /Buongiorno/ })).toBeVisible();
  await page.getByRole('link', { name: 'Formulari FIR' }).click();
  await expect(page.getByRole('heading', { name: 'Formulari FIR' })).toBeVisible();
  await page.getByRole('link', { name: /Nuovo FIR/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Prepara un nuovo FIR' })).toBeVisible();
});

test('ricerca globale da tastiera', async ({ page }) => {
  await page.goto('/app/dashboard');
  await page.keyboard.press('Control+K');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Nuovo movimento')).toBeVisible();
});
