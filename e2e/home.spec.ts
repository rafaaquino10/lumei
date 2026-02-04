import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    // Verifica se o título está correto
    await expect(page).toHaveTitle(/Calcula MEI/)

    // Verifica se o header está visível
    await expect(page.locator('header')).toBeVisible()

    // Verifica se o CTA principal existe
    await expect(page.getByRole('link', { name: /calculadora/i })).toBeVisible()
  })

  test('should navigate to calculadoras page', async ({ page }) => {
    await page.goto('/')

    // Clica no link de calculadoras
    await page.getByRole('link', { name: /calculadora/i }).first().click()

    // Verifica se navegou para a página correta
    await expect(page).toHaveURL(/calculadoras/)
  })

  test('should have working footer links', async ({ page }) => {
    await page.goto('/')

    // Verifica se os links do footer existem
    await expect(page.getByRole('link', { name: /privacidade/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /termos/i })).toBeVisible()
  })
})
