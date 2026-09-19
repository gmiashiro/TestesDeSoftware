import { test, expect } from '@playwright/test';

test.describe('cálculo de frete', () => {
  test.describe('caminhos válidos e regras de frete', () => {
    test('calcula frete de R$ 15,00 para CEP iniciado por 8 com valor menor que R$ 200,00', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('80000000');
      await page.getByLabel('Valor do pedido').fill('100.00');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete: R$ 15,00');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('calcula frete de R$ 15,00 no limite máximo antes do frete grátis (R$ 199,99) para CEP iniciado por 8', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('87654321');
      await page.getByLabel('Valor do pedido').fill('199.99');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete: R$ 15,00');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('calcula frete de R$ 25,00 para CEP não iniciado por 8 com valor menor que R$ 200,00', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('01000000');
      await page.getByLabel('Valor do pedido').fill('100.00');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete: R$ 25,00');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('calcula frete de R$ 25,00 no limite máximo antes do frete grátis (R$ 199,99) para CEP não iniciado por 8', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('12345678');
      await page.getByLabel('Valor do pedido').fill('199.99');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete: R$ 25,00');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('aplica frete grátis no limite exato de R$ 200,00 para CEP iniciado por 8', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('80000000');
      await page.getByLabel('Valor do pedido').fill('200.00');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete grátis');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('aplica frete grátis no limite exato de R$ 200,00 para CEP não iniciado por 8', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('01000000');
      await page.getByLabel('Valor do pedido').fill('200.00');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete grátis');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('aplica frete grátis para valor acima de R$ 200,00', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('80000000');
      await page.getByLabel('Valor do pedido').fill('250.50');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete grátis');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('aceita valor informado com vírgula em vez de ponto', async ({ page }) => {
      await page.goto('/frete');
      await page.getByLabel('CEP').fill('80000000');
      await page.getByLabel('Valor do pedido').fill('150,50');
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Frete: R$ 15,00');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });
  });

  test.describe('dados inválidos (classes de equivalência e valores-limite)', () => {
    const casosInvalidos = [
      { cep: '1234567', valor: '100.00', motivo: 'CEP com 7 dígitos (menos de 8)' },
      { cep: '123456789', valor: '100.00', motivo: 'CEP com 9 dígitos (mais de 8)' },
      { cep: '84000-00', valor: '100.00', motivo: 'CEP com caracteres especiais/hífen' },
      { cep: 'abcdefgh', valor: '100.00', motivo: 'CEP não numérico' },
      { cep: '', valor: '100.00', motivo: 'CEP vazio' },
      { cep: '80000000', valor: '0', motivo: 'Valor zero' },
      { cep: '80000000', valor: '0.00', motivo: 'Valor zero com decimais' },
      { cep: '80000000', valor: '-50.00', motivo: 'Valor negativo' },
      { cep: '80000000', valor: '100.123', motivo: 'Valor com mais de 2 casas decimais' },
      { cep: '80000000', valor: 'abc', motivo: 'Valor não numérico' },
      { cep: '80000000', valor: '', motivo: 'Valor vazio' },
    ];

    for (const caso of casosInvalidos) {
      test(`exibe mensagem de dados inválidos: ${caso.motivo}`, async ({ page }) => {
        await page.goto('/frete');
        await page.getByLabel('CEP').fill(caso.cep);
        await page.getByLabel('Valor do pedido').fill(caso.valor);
        await page.getByRole('button', { name: 'Calcular frete' }).click();

        const resultado = page.locator('#resultado');
        await expect(resultado).toBeVisible();
        await expect(resultado).toHaveText('Dados inválidos');
        await expect(resultado).toHaveAttribute('role', 'alert');
        await expect(resultado).not.toHaveClass('success');
      });
    }
  });
});
