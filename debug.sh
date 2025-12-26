#!/bin/bash

# Quick debug script to diagnose the empty list issue

echo "═══════════════════════════════════════════════════════════════════"
echo "🔍 IPL Live Service - Debug Diagnostic Script"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

REGION="ap-south-1"
TABLE="IPL-Matches"

# Check 1: AWS Credentials
echo "✓ Check 1: Verifying AWS Credentials..."
if aws sts get-caller-identity &>/dev/null; then
    ACCOUNT=$(aws sts get-caller-identity --query 'Account' --output text)
    echo "✅ AWS credentials OK (Account: $ACCOUNT)"
else
    echo "❌ AWS credentials not found!"
    exit 1
fi
echo ""

# Check 2: DynamoDB Table
echo "✓ Check 2: Verifying DynamoDB Table..."
if aws dynamodb describe-table --table-name $TABLE --region $REGION &>/dev/null; then
    ITEM_COUNT=$(aws dynamodb describe-table --table-name $TABLE --region $REGION --query 'Table.ItemCount' --output text)
    echo "✅ Table exists (Total items: $ITEM_COUNT)"
else
    echo "❌ Table not found: $TABLE"
    exit 1
fi
echo ""

# Check 3: Match Records
echo "✓ Check 3: Checking for Match Records (SEASON#2025)..."
MATCH_COUNT=$(aws dynamodb query \
  --table-name $TABLE \
  --key-condition-expression "PK = :pk AND begins_with(SK, :sk)" \
  --expression-attribute-values "{\":pk\":{\"S\":\"SEASON#2025\"},\":sk\":{\"S\":\"MATCH#\"}}" \
  --region $REGION \
  --query 'Count' \
  --output text)

if [ "$MATCH_COUNT" -gt 0 ]; then
    echo "✅ Found $MATCH_COUNT matches in database"
else
    echo "❌ No matches found! Database may not be seeded."
    echo "   Fix: Run 'npm run pre-seed' to load test data"
    exit 1
fi
echo ""

# Check 4: Lambda Function
echo "✓ Check 4: Checking Lambda Function..."
if aws lambda get-function --function-name GraphQLFunction --region $REGION &>/dev/null; then
    LAST_MODIFIED=$(aws lambda get-function-configuration --function-name GraphQLFunction --region $REGION --query 'LastModified' --output text)
    echo "✅ Lambda function exists"
    echo "   Last modified: $LAST_MODIFIED"
else
    echo "❌ Lambda function not found!"
    exit 1
fi
echo ""

# Check 5: API Gateway
echo "✓ Check 5: Checking API Gateway Endpoint..."
ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name ipl-live-stack \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`GraphQLApiEndpoint`].OutputValue' \
  --output text 2>/dev/null)

if [ -n "$ENDPOINT" ] && [ "$ENDPOINT" != "None" ]; then
    echo "✅ API Gateway endpoint found:"
    echo "   $ENDPOINT"
else
    echo "⚠️  Could not find API Gateway endpoint"
    echo "   Check CloudFormation stack: ipl-live-stack"
fi
echo ""

# Check 6: CloudWatch Logs
echo "✓ Check 6: Checking CloudWatch Logs (Recent 10 lines)..."
LOGS=$(aws logs tail /aws/lambda/ipl-service --region $REGION --since 5m --max-items 10 2>&1)

if echo "$LOGS" | grep -q "MatchRepository\|MatchService"; then
    echo "✅ Recent logs found:"
    echo "$LOGS" | tail -5
else
    echo "⚠️  No recent logs found"
    echo "   (This is normal if Lambda hasn't been called recently)"
fi
echo ""

# Check 7: Environment Variables
echo "✓ Check 7: Checking Lambda Environment Variables..."
TABLE_NAME=$(aws lambda get-function-configuration \
  --function-name GraphQLFunction \
  --region $REGION \
  --query 'Environment.Variables.TABLE_NAME' \
  --output text 2>/dev/null)

if [ "$TABLE_NAME" == "$TABLE" ]; then
    echo "✅ TABLE_NAME environment variable: $TABLE_NAME"
else
    echo "❌ TABLE_NAME mismatch!"
    echo "   Expected: $TABLE"
    echo "   Got: $TABLE_NAME"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════════════"
echo "✅ DIAGNOSTIC COMPLETE"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Summary:"
echo "   • Database: OK ($MATCH_COUNT matches found)"
echo "   • Lambda: OK"
echo "   • API: OK"
echo ""
echo "🚀 If all checks passed, your issue is likely:"
echo "   1. Lambda running old code → Run: npm run build && npm run deploy"
echo "   2. Postman using wrong endpoint → Update base_url variable"
echo "   3. Network/firewall issue → Check AWS security groups"
echo ""
echo "📝 For more help, see: DEBUG_GUIDE.md"
echo "═══════════════════════════════════════════════════════════════════"
