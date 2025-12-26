#!/bin/bash

# Force complete rebuild and redeployment

echo "═══════════════════════════════════════════════════════════════════"
echo "🔄 IPL Live Service - Force Clean Build & Deploy"
echo "═══════════════════════════════════════════════════════════════════"

# Step 1: Clean previous builds
echo ""
echo "Step 1: Cleaning previous builds..."
rm -rf dist/ .webpack-cache/ .ts-cache 2>/dev/null
echo "✅ Cleaned"

# Step 2: Install dependencies fresh
echo ""
echo "Step 2: Installing dependencies..."
npm install --no-save
echo "✅ Dependencies installed"

# Step 3: Build with fresh TypeScript
echo ""
echo "Step 3: Building TypeScript..."
npm run build
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"

# Step 4: Verify build output
echo ""
echo "Step 4: Verifying build output..."
if [ -f "dist/server.js" ]; then
    FILE_SIZE=$(ls -lh dist/server.js | awk '{print $5}')
    echo "✅ dist/server.js exists ($FILE_SIZE)"
else
    echo "❌ dist/server.js not found!"
    exit 1
fi

if [ -f "dist/graphql/schema.graphql" ]; then
    echo "✅ dist/graphql/schema.graphql exists"
else
    echo "❌ dist/graphql/schema.graphql not found!"
    exit 1
fi

# Step 5: Deploy to AWS
echo ""
echo "Step 5: Deploying to AWS Lambda..."
echo "⏳ This may take 2-5 minutes..."

# Use sam deploy with a timestamp parameter to force CloudFormation to detect a change
DEPLOY_MARKER=$(date +%s)
echo "Using DeployMarker=$DEPLOY_MARKER"
# Ensure SAM build picks up template changes
echo "Running 'sam build' to prepare deployment artifacts..."
sam build
if [ $? -ne 0 ]; then
    echo "❌ sam build failed!"
    exit 1
fi

sam deploy --parameter-overrides DeployMarker=$DEPLOY_MARKER
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -ne 0 ]; then
    echo "❌ Deploy failed!"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE!"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Copy the GraphQL endpoint from above"
echo "2. Test in Postman with updated endpoint"
echo "3. Check CloudWatch logs for detailed output:"
echo ""
echo "   aws logs tail /aws/lambda/ipl-service --follow --region ap-south-1"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
