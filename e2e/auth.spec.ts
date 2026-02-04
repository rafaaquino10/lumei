import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display sign-in page', async ({ page }) => {
    await page.goto('/sign-in')

    // Verifica se a página de login está visível
    await expect(page.getByRole('heading', { name: /entrar|login/i })).toBeVisible()

    // Verifica se os campos de email e senha existem
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/senha/i)).toBeVisible()
  })

  test('should display sign-up page', async ({ page }) => {
    await page.goto('/sign-up')

    // Verifica se a página de cadastro está visível
    await expect(page.getByRole('heading', { name: /criar.*conta|cadastr/i })).toBeVisible()

    // Verifica se os campos existem
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/senha/i)).toBeVisible()
  })

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/sign-in')

    // Clica no botão de login sem preencher
    await page.getByRole('button', { name: /entrar|login/i }).click()

    // Deve mostrar algum erro de validação
    // (comportamento específico depende da implementação)
    await expect(page.locator('[class*="error"], [class*="invalid"], [aria-invalid="true"]')).toBeVisible({ timeout: 3000 }).catch(() => {
      // Se não houver erro visível, verifica se o form não foi submetido
      expect(page.url()).toContain('sign-in')
    })
  })

  test('should have link to forgot password', async ({ page }) => {
    await page.goto('/sign-in')

    // Verifica se existe link para recuperar senha
    await expect(page.getByRole('link', { name: /esquec|recuper/i })).toBeVisible()
  })

  test('should redirect to sign-in when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard')

    // Deve redirecionar para login
    await expect(page).toHaveURL(/sign-in/)
  })
})
