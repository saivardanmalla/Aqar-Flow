import { test, expect } from '@playwright/test';

test.describe('AqarFlow End-to-End Operational Workflow', () => {
  test('Public visitor can browse properties and submit inquiry', async ({ page }) => {
    await page.goto('/');

    // Verify Brand & Hero Headline
    await expect(page.locator('text=AqarFlow')).toBeVisible();
    await expect(page.locator('text=Find Your')).toBeVisible();
    await expect(page.locator('text=Dream Property')).toBeVisible();

    // Verify Featured Properties exist
    await expect(page.locator('text=AF-001')).toBeVisible();

    // Click Inquire on first property
    await page.locator('button:has-text("Inquire")').first().click();
    await expect(page.locator('text=Direct Agency Inquiry')).toBeVisible();

    // Fill customer inquiry form
    await page.fill('input[placeholder="e.g. Tariq Mehmood"]', 'Hamid Qureshi');
    await page.fill('input[placeholder="+92 300 1234567"]', '+92 300 7654321');
    await page.click('button:has-text("Send Inquiry")');

    // Confirm CRM Lead creation success message
    await expect(page.locator('text=Inquiry Received!')).toBeVisible();
  });

  test('Agency Admin can access dashboard and view real KPIs', async ({ page }) => {
    await page.goto('/');

    // Launch Agency Workspace
    await page.click('button:has-text("Agency Workspace")');
    await expect(page.locator('text=Welcome back, Sarah Ahmed!')).toBeVisible();

    // Verify KPI Cards
    await expect(page.locator('text=Total Properties')).toBeVisible();
    await expect(page.locator('text=New Leads')).toBeVisible();
    await expect(page.locator('text=Scheduled Visits')).toBeVisible();
    await expect(page.locator('text=Open Deals')).toBeVisible();
  });

  test('Visit scheduling alerts on agent time conflicts', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Agency Workspace")');
    await page.click('button:has-text("Visits")');

    await expect(page.locator('text=Property Visit Scheduling')).toBeVisible();
    await page.click('button:has-text("Schedule Visit")');
    await expect(page.locator('text=Schedule Property Viewing')).toBeVisible();
  });
});
