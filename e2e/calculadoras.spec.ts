import { test, expect } from '@playwright/test'

test.describe('Calculadoras Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculadoras')
  })

  test('should display all 6 calculators', async ({ page }) => {
    // Verifica se todas as calculadoras estão listadas
    await expect(page.getByText('Margem de Lucro')).toBeVisible()
    await expect(page.getByText('Preço por Hora')).toBeVisible()
    await expect(page.getByText('Precificação')).toBeVisible()
    await expect(page.getByText('Faturamento')).toBeVisible()
    await expect(page.getByText('Fluxo de Caixa')).toBeVisible()
    await expect(page.getByText('DAS')).toBeVisible()
  })

  test('should switch between calculators', async ({ page }) => {
    // Clica na calculadora de preço por hora
    await page.getByText('Preço por Hora').click()

    // Verifica se o título da calculadora mudou
    await expect(page.getByRole('heading', { name: /preço.*hora/i })).toBeVisible()
  })

  test('should calculate margem de lucro', async ({ page }) => {
    // Garante que está na calculadora de margem
    await page.getByText('Margem de Lucro').click()

    // Preenche os campos
    await page.getByLabel(/custo/i).fill('100')
    await page.getByLabel(/preço.*venda/i).fill('150')

    // Clica no botão calcular
    await page.getByRole('button', { name: /calcular/i }).click()

    // Aguarda o resultado (pode estar borrado para não-logados)
    await expect(page.locator('text=/\\d+.*%/')).toBeVisible({ timeout: 5000 })
  })

  test('should show DAS calendar values', async ({ page }) => {
    // Vai para a calculadora DAS
    await page.getByText('DAS').click()

    // Verifica se mostra valores do DAS
    await expect(page.getByText(/R\$\s*\d+,\d{2}/)).toBeVisible()
  })
})
