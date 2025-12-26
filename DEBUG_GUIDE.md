# Debugging Empty Match List - Complete Guide

## Issue
GraphQL query `listMatches(season: 2025)` returns empty array `[]` even though:
- ✅ Database has 74 matches
- ✅ Local testing works perfectly
- ✅ Lambda deployment succeeded

## Root Cause
The Lambda function is likely running **stale code** from before recent updates. The old build didn't have logging, so you can't see what's happening.

---

## Solution: Step-by-Step

### Step 1: Force Clean Deployment

#### Option A: Use the provided script (Recommended)
```bash
bash deploy-fresh.sh
```

This will:
1. Clean all old builds
2. Rebuild from scratch
3. Deploy fresh to AWS
4. Show CloudWatch logs

#### Option B: Manual steps
```bash
# Clean everything
rm -rf dist/ .webpack-cache/ node_modules/.cache

# Rebuild
npm run build

# Verify build output exists
ls -lh dist/server.js
ls -lh dist/graphql/schema.graphql

# Deploy
npm run deploy
```

### Step 2: Verify Deployment

After deployment, get the API endpoint:
```bash
# Option 1: From CloudFormation
aws cloudformation describe-stacks \
  --stack-name ipl-live-stack \
  --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`GraphQLApiEndpoint`].OutputValue' \
  --output text

# Option 2: From SAM output (look for URL in deploy output)
# Save this URL - you'll need it for Postman
```

### Step 3: Check CloudWatch Logs

The enhanced logging will show exactly what's happening:

```bash
# Follow logs in real-time
aws logs tail /aws/lambda/ipl-service --follow --region ap-south-1

# Or view recent logs
aws logs tail /aws/lambda/ipl-service --region ap-south-1 --since 5m
```

Expected output when running `listMatches`:
```
[MatchService.listMatches] STARTING - Season: 2025
[MatchRepository.list] STARTING - Querying table: IPL-Matches, PK: SEASON#2025, Season: 2025
[MatchRepository.list] SUCCESS - Returned 74 items
[MatchService.listMatches] SUCCESS - Got 74 matches
```

### Step 4: Test in Postman

1. Open Postman
2. Import `IPL_Live_Service.postman_collection.json`
3. Set `base_url` variable to your API endpoint
4. Send "List All Matches by Season" request
5. Should now see 74 matches! ✅

---

## Troubleshooting by Symptom

### Symptom 1: Still Getting Empty Array After Deployment

**Check:**
1. Did you save the NEW API endpoint from deployment?
   ```bash
   # Check which endpoint Postman is using
   # (Look in Postman Variables tab for base_url)
   ```

2. Is the Lambda running the new code?
   ```bash
   # Check timestamp of last function update
   aws lambda get-function-configuration \
     --function-name ipl-service \
     --region ap-south-1 | jq '.LastModified'
   ```

3. Check for errors in CloudWatch:
   ```bash
   aws logs tail /aws/lambda/ipl-service --since 10m
   ```

**Fix:**
- [ ] Copy new endpoint to Postman variables
- [ ] Wait 30 seconds after deployment (cache)
- [ ] Clear browser cache if using web client
- [ ] Try in Postman again

---

### Symptom 2: "Unable to connect to endpoint" in Postman

**Check:**
1. Is the endpoint URL correct?
   ```bash
   # Should be: https://XXXXX.execute-api.ap-south-1.amazonaws.com/Prod
   # NOT: https://XXXXX.execute-api.ap-south-1.amazonaws.com/Prod/graphql
   ```

2. Is the Lambda function active?
   ```bash
   aws lambda get-function --function-name ipl-service --region ap-south-1
   ```

**Fix:**
- [ ] Remove `/graphql` from base_url (already included in collection)
- [ ] Check AWS credentials are set: `aws sts get-caller-identity`
- [ ] Verify Lambda is deployed: `aws lambda list-functions --region ap-south-1 | grep -i ipl`

---

### Symptom 3: Lambda Error or 500 Response

**Check logs:**
```bash
aws logs tail /aws/lambda/ipl-service --since 5m
```

**Common errors:**
- `table not found` → Wrong table name in environment
- `UnrecognizedClientException` → AWS credentials expired
- `ValidationException` → Invalid DynamoDB query

**Fix:**
- [ ] Verify TABLE_NAME environment variable: `echo $TABLE_NAME`
- [ ] Verify AWS credentials: `aws sts get-caller-identity`
- [ ] Check table exists: `aws dynamodb list-tables --region ap-south-1`

---

### Symptom 4: Deployment Says Success But Old Code Still Running

**Root cause:** Lambda is cached or wasn't actually updated

**Fix:**
```bash
# Force a new version
aws lambda update-function-code \
  --function-name GraphQLFunction \
  --zip-file fileb://dist/server.js \
  --region ap-south-1

# Or use the clean deploy script
bash deploy-fresh.sh
```

---

## Complete Debugging Checklist

- [ ] Run: `npm run build` (check for errors)
- [ ] Check: `ls -la dist/server.js` (file exists and recent)
- [ ] Run: `npm run deploy` (capture endpoint)
- [ ] Check: CloudWatch logs for `[MatchService` and `[MatchRepository`
- [ ] Update: Postman base_url variable
- [ ] Test: Send request and check response
- [ ] Verify: 74 matches returned ✅

---

## What the Logs Should Show

### Working (Data Being Returned)
```
[MatchService.listMatches] STARTING - Season: 2025
[MatchRepository.list] STARTING - Querying table: IPL-Matches, PK: SEASON#2025
[MatchRepository.list] SUCCESS - Returned 74 items
[MatchService.listMatches] SUCCESS - Got 74 matches
[MatchService.listMatches] Sample: {"id": "match-1", "season": 2025, ...}
```

### Not Working (Data Not Returned)
```
[MatchService.listMatches] STARTING - Season: 2025
[MatchRepository.list] STARTING - Querying table: IPL-Matches, PK: SEASON#2025
[MatchRepository.list] SUCCESS - Returned 0 items
[MatchService.listMatches] SUCCESS - Got 0 matches
```

If you see "Returned 0 items", the database query is working but no matches exist. Check if seed data was loaded.

---

## Database Status Check

```bash
# Count all items in table
aws dynamodb query \
  --table-name IPL-Matches \
  --key-condition-expression "PK = :pk" \
  --expression-attribute-values '{":pk":{"S":"SEASON#2025"}}' \
  --region ap-south-1 \
  --query 'Count'

# Should return: 74 (the number of matches)
```

---

## If Still Empty After All Steps

1. **Check if seed data was actually loaded:**
   ```bash
   npm run pre-seed
   ```

2. **Check table structure:**
   ```bash
   aws dynamodb describe-table \
     --table-name IPL-Matches \
     --region ap-south-1 \
     --query 'Table.ItemCount'
   ```

3. **Manually verify data exists:**
   ```bash
   aws dynamodb scan \
     --table-name IPL-Matches \
     --filter-expression "attribute_exists(#t)" \
     --expression-attribute-names '{"#t":"type"}' \
     --expression-attribute-values '{":type":{"S":"MATCH"}}' \
     --max-items 5 \
     --region ap-south-1
   ```

---

## Quick Commands Reference

```bash
# View all commands
npm run

# Build only
npm run build

# Deploy only
npm run deploy

# Fresh deploy (script)
bash deploy-fresh.sh

# Check logs (real-time)
aws logs tail /aws/lambda/ipl-service --follow --region ap-south-1

# List matches from CLI
aws dynamodb query \
  --table-name IPL-Matches \
  --key-condition-expression "PK = :pk AND begins_with(SK, :sk)" \
  --expression-attribute-values '{":pk":{"S":"SEASON#2025"},":sk":{"S":"MATCH#"}}' \
  --region ap-south-1 \
  --query 'Count'
```

---

## Next: Verify Everything is Working

After deployment, test this exact flow:

1. **Check logs show correct output:**
   ```bash
   aws logs tail /aws/lambda/ipl-service --since 2m | grep MatchRepository
   ```

2. **Run Postman request**
3. **See 74 matches in response**
4. **Celebrate! 🎉**

If issues persist, share the CloudWatch log output and we can diagnose from there.
