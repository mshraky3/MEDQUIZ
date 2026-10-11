/**
 * pivotCampaignRows: the "by campaign" table of the admin funnel panel.
 *
 * The SQL that feeds it was run against PGlite when this was written (tagged
 * events only, 7-day window, distinct people per step); this pins the pivot.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { pivotCampaignRows } from './adminMetricsService.js';

test('groups steps per campaign/source/content and sums both signup routes', () => {
    const rows = [
        { campaign: 'golden_months', source: 'email', content: 'tier_b', event: 'campaign_touch', actors: 10 },
        { campaign: 'golden_months', source: 'email', content: 'tier_b', event: 'subscribe_view', actors: 4 },
        { campaign: 'golden_months', source: 'email', content: 'tier_b', event: 'subscribe_pay_click', actors: 2 },
        { campaign: 'golden_months', source: 'email', content: 'tier_b', event: 'payment_success', actors: 1 },
        { campaign: 'admin_swap', source: 'telegram', content: 'smle_top10', event: 'landing_view', actors: 40 },
        { campaign: 'admin_swap', source: 'telegram', content: 'smle_top10', event: 'campaign_touch', actors: 55 },
        { campaign: 'admin_swap', source: 'telegram', content: 'smle_top10', event: 'signup_otp_verified', actors: 3 },
        { campaign: 'admin_swap', source: 'telegram', content: 'smle_top10', event: 'signup_google_created', actors: 9 },
    ];
    const out = pivotCampaignRows(rows);
    assert.equal(out.length, 2);

    // Sorted by visits: the Telegram swap (55) before the email (10).
    assert.equal(out[0].campaign, 'admin_swap');
    assert.equal(out[0].visits, 55, 'visits is the larger of landing_view and campaign_touch');
    assert.equal(out[0].signups, 12, 'email OTP and Google sign-ups are added');

    assert.deepEqual(
        { views: out[1].subscribeViews, clicks: out[1].payClicks, paid: out[1].paid, failed: out[1].paymentFailed },
        { views: 4, clicks: 2, paid: 1, failed: 0 },
    );
});

test('no rows gives an empty table, not an error', () => {
    assert.deepEqual(pivotCampaignRows([]), []);
    assert.deepEqual(pivotCampaignRows(undefined), []);
});
