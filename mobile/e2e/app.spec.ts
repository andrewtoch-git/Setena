import { expect, test } from '@playwright/test';

// Pruebas de humo que no dependen de los datos de la API.
test('abre Explorar con la barra inferior de 4 pestañas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Explorar' })).toBeVisible();
  for (const pestana of ['Explorar', 'Favoritos', 'Chats', 'Mi perfil']) {
    await expect(page.locator('ion-tab-bar')).toContainText(pestana);
  }
  await expect(page.getByPlaceholder('Buscar músicos')).toBeVisible();
});

test('sin sesión, Favoritos invita a registrarse', async ({ page }) => {
  await page.goto('/tabs/favoritos');
  await expect(page.getByText('¡La música se disfruta más en comunidad!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Regístrate gratis' })).toBeVisible();
});
