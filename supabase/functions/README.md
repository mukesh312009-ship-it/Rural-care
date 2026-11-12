# Supabase Edge Functions for RuralCare

This directory contains serverless TypeScript edge functions for RuralCare operations:

1. `send-sms-reminder`: Integrates with rural SMS gateways (NIC/CDAC/Fast2SMS) to dispatch multilingual SMS reminders for appointments and follow-up visits.
2. `abdm-gateway-bridge`: Sandbox adapter for Ayushman Bharat Digital Mission (ABDM) milestone milestones (ABHA verification, consent artifact signing).
3. `emergency-alert-dispatch`: Webhook to notify designated local health workers and registered feeder transport providers when an emergency is submitted.

To deploy functions:
```bash
supabase functions deploy send-sms-reminder
supabase functions deploy abdm-gateway-bridge
supabase functions deploy emergency-alert-dispatch
```
