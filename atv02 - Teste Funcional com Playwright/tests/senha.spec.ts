import { test, expect } from '@playwright/test';

test.describe('cadastro de senha', () => {
  test.describe('caminhos válidos e limites de senha', () => {
    test('permite cadastro com senha válida no limite mínimo de 8 caracteres', async ({ page }) => {
      await page.goto('/senha');

      await page.getByLabel('Nova senha').fill('Ab123456');
      await page.getByLabel('Confirmar senha').fill('Ab123456');
      await page.getByRole('button', { name: 'Cadastrar senha' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Senha cadastrada');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');

      await expect(page.getByLabel('Nova senha')).toHaveValue('');
      await expect(page.getByLabel('Confirmar senha')).toHaveValue('');
    });

    test('permite cadastro com senha válida no limite máximo de 20 caracteres', async ({ page }) => {
      await page.goto('/senha');

      const senha20 = 'Ab123456789012345678';
      await page.getByLabel('Nova senha').fill(senha20);
      await page.getByLabel('Confirmar senha').fill(senha20);
      await page.getByRole('button', { name: 'Cadastrar senha' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Senha cadastrada');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });

    test('permite cadastro com senha válida contendo caracteres especiais', async ({ page }) => {
      await page.goto('/senha');

      await page.getByLabel('Nova senha').fill('SenhaSegura123!');
      await page.getByLabel('Confirmar senha').fill('SenhaSegura123!');
      await page.getByRole('button', { name: 'Cadastrar senha' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Senha cadastrada');
      await expect(resultado).toHaveAttribute('role', 'status');
      await expect(resultado).toHaveClass('success');
    });
  });

  test.describe('regras de padrão inválido (classes de equivalência e valores-limite)', () => {
    const casosInvalidos = [
      { senha: 'Ab12345', motivo: '7 caracteres (abaixo do mínimo de 8)' },
      { senha: 'Ab1234567890123456789', motivo: '21 caracteres (acima do máximo de 20)' },
      { senha: 'senha1234', motivo: 'sem letra maiúscula' },
      { senha: 'SENHA1234', motivo: 'sem letra minúscula' },
      { senha: 'SenhaSemNumero', motivo: 'sem número' },
      { senha: 'Senha 1234', motivo: 'contém espaço em branco' },
      { senha: '', motivo: 'senha vazia' },
    ];

    for (const caso of casosInvalidos) {
      test(`rejeita senha fora do padrão: ${caso.motivo}`, async ({ page }) => {
        await page.goto('/senha');

        await page.getByLabel('Nova senha').fill(caso.senha);
        await page.getByLabel('Confirmar senha').fill(caso.senha);
        await page.getByRole('button', { name: 'Cadastrar senha' }).click();

        const resultado = page.locator('#resultado');
        await expect(resultado).toBeVisible();
        await expect(resultado).toHaveText('Senha fora do padrão');
        await expect(resultado).toHaveAttribute('role', 'alert');
        await expect(resultado).not.toHaveClass('success');
      });
    }
  });

  test.describe('confirmação de senha', () => {
    test('rejeita quando a confirmação não coincide com a nova senha', async ({ page }) => {
      await page.goto('/senha');

      await page.getByLabel('Nova senha').fill('SenhaValida123');
      await page.getByLabel('Confirmar senha').fill('SenhaDiferente123');
      await page.getByRole('button', { name: 'Cadastrar senha' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('As senhas não coincidem');
      await expect(resultado).toHaveAttribute('role', 'alert');
      await expect(resultado).not.toHaveClass('success');
    });
  });
});
