# Postman Collection - IPL Live Service GraphQL API

## Overview
This Postman collection provides a complete set of GraphQL queries and mutations for the IPL Live Service API.

## Setup Instructions

### 1. Import the Collection
- Open Postman
- Click "Import" button (top left)
- Select the file: `IPL_Live_Service.postman_collection.json`
- Click "Import"

### 2. Configure Environment Variables
The collection uses the following variables that need to be set:

#### Method 1: Quick Setup (Using Variables Tab)
1. After importing, go to the collection settings
2. Click the "Variables" tab
3. Set the following values:

| Variable | Value | Example |
|----------|-------|---------|
| `base_url` | Your API Gateway endpoint | `https://abc123def.execute-api.ap-south-1.amazonaws.com/Prod` |
| `api_id` | Your API Gateway ID | `abc123def` |
| `region` | AWS region | `ap-south-1` |

#### Method 2: Environment File (Recommended)
1. Create a new Environment in Postman
2. Name it "IPL Live Service"
3. Add these variables:
   ```json
   {
     "base_url": "https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/Prod",
     "api_id": "YOUR_API_ID",
     "region": "ap-south-1"
   }
   ```
4. Select this environment before running requests

### 3. Find Your API Gateway URL
After deploying with SAM:
```bash
sam deploy --guided
```

Look for output like:
```
GraphQLApiEndpoint: https://abc123def.execute-api.ap-south-1.amazonaws.com/Prod/graphql
```

Use the part before `/graphql` as your `base_url`.

---

## API Endpoints

### Query Operations (Read-Only)

#### 1. List All Matches by Season
**Request Name:** `List All Matches by Season`

**Purpose:** Fetch all matches for a given season

**Variables:**
```json
{
  "season": 2025
}
```

**Response Example:**
```json
{
  "data": {
    "listMatches": [
      {
        "id": "match-1",
        "season": 2025,
        "teamA": "MI",
        "teamB": "CSK",
        "status": "UPCOMING",
        "startTime": "2025-03-22T14:00:00.000Z",
        "score": {
          "teamA": 0,
          "teamB": 0,
          "overs": 0
        }
      }
    ]
  }
}
```

---

#### 2. Get Specific Match
**Request Name:** `Get Specific Match`

**Purpose:** Fetch details of a specific match by ID

**Variables:**
```json
{
  "season": 2025,
  "id": "match-1"
}
```

**Response Example:**
```json
{
  "data": {
    "getMatch": {
      "id": "match-1",
      "season": 2025,
      "teamA": "MI",
      "teamB": "CSK",
      "status": "UPCOMING",
      "startTime": "2025-03-22T14:00:00.000Z",
      "score": {
        "teamA": 0,
        "teamB": 0,
        "overs": 0
      }
    }
  }
}
```

---

#### 3. List Matches by Status
**Request Name:** `List Matches by Status`

**Purpose:** Filter matches by their current status

**Variables:**
```json
{
  "season": 2025,
  "status": "UPCOMING"
}
```

**Status Options:**
- `UPCOMING` - Match hasn't started
- `LIVE` - Match is currently being played
- `COMPLETED` - Match has finished

**Response Example:**
```json
{
  "data": {
    "listMatchesByStatus": [
      {
        "id": "match-1",
        "season": 2025,
        "teamA": "MI",
        "teamB": "CSK",
        "status": "UPCOMING",
        "startTime": "2025-03-22T14:00:00.000Z",
        "score": {
          "teamA": 0,
          "teamB": 0,
          "overs": 0
        }
      }
    ]
  }
}
```

---

### Mutation Operations (Write/Update)

#### 4. Create New Match
**Request Name:** `Create New Match`

**Purpose:** Create a new match in the system

**Variables:**
```json
{
  "season": 2025,
  "teamA": "MI",
  "teamB": "CSK",
  "startTime": "2025-12-30T14:00:00Z"
}
```

**Parameters:**
- `season` (Int, required): Tournament season year
- `teamA` (String, required): Team A code (e.g., "MI", "CSK", "RCB")
- `teamB` (String, required): Team B code
- `startTime` (String, required): ISO 8601 timestamp

**Response Example:**
```json
{
  "data": {
    "createMatch": {
      "id": "12345-uuid",
      "season": 2025,
      "teamA": "MI",
      "teamB": "CSK",
      "status": "UPCOMING",
      "startTime": "2025-12-30T14:00:00Z",
      "score": {
        "teamA": 0,
        "teamB": 0,
        "overs": 0
      }
    }
  }
}
```

---

#### 5. Update Match Status
**Request Name:** `Update Match Status`

**Purpose:** Change the status of a match (Start/Complete a match)

**Variables:**
```json
{
  "season": 2025,
  "id": "match-1",
  "status": "LIVE"
}
```

**Status Transitions:**
- `UPCOMING` → `LIVE` (when match starts)
- `LIVE` → `COMPLETED` (when match ends)

**Response Example:**
```json
{
  "data": {
    "updateMatchStatus": {
      "id": "match-1",
      "season": 2025,
      "teamA": "MI",
      "teamB": "CSK",
      "status": "LIVE",
      "startTime": "2025-03-22T14:00:00.000Z",
      "score": {
        "teamA": 0,
        "teamB": 0,
        "overs": 0
      }
    }
  }
}
```

---

#### 6. Add/Update Match Score
**Request Name:** `Add/Update Match Score`

**Purpose:** Update the score of a match

**Variables:**
```json
{
  "season": 2025,
  "id": "match-1",
  "teamA": 156,
  "teamB": 142,
  "overs": 19.5
}
```

**Validation:**
- ✅ `teamA` and `teamB` must be ≥ 0
- ✅ `overs` must be between 0 and 20
- ❌ Negative scores will throw error: "Scores cannot be negative"
- ❌ Overs > 20 will throw error: "Overs must be between 0 and 20"

**Response Example:**
```json
{
  "data": {
    "addScore": {
      "id": "match-1",
      "season": 2025,
      "teamA": "MI",
      "teamB": "CSK",
      "status": "LIVE",
      "startTime": "2025-03-22T14:00:00.000Z",
      "score": {
        "teamA": 156,
        "teamB": 142,
        "overs": 19.5
      }
    }
  }
}
```

---

#### 7. Record Ball Event
**Request Name:** `Record Ball Event`

**Purpose:** Record individual ball deliveries during a match (updates match score, batter stats, bowler stats)

**Variables:**
```json
{
  "input": {
    "season": 2025,
    "matchId": "match-1",
    "inning": 1,
    "over": 5,
    "ball": 3,
    "batterId": "RohitSharma",
    "bowlerId": "DeepakChahar",
    "runsScored": 4,
    "extras": 0,
    "isWicket": false
  }
}
```

**Input Parameters:**
- `season` (Int, required): Tournament season
- `matchId` (ID, required): Match ID
- `inning` (Int, required): 1 (First inning) or 2 (Second inning)
- `over` (Int, required): Over number (0-19 for 20 overs cricket)
- `ball` (Int, required): Ball number in the over (1-6)
- `batterId` (String, required): Batter's name/ID
- `bowlerId` (String, required): Bowler's name/ID
- `runsScored` (Int, required): Runs off the bat (0, 1, 4, 6)
- `extras` (Int, required): Extra runs (0 or 1 for wide/no-ball)
- `isWicket` (Boolean, required): Whether a wicket fell

**Response Example:**
```json
{
  "data": {
    "recordBall": {
      "success": true,
      "message": "Ball recorded successfully"
    }
  }
}
```

**Error Response:**
```json
{
  "data": {
    "recordBall": {
      "success": false,
      "message": "DB Error: ConditionalCheckFailedException"
    }
  }
}
```

---

## Team Codes Reference

| Code | Team Name | Home Venue |
|------|-----------|-----------|
| MI | Mumbai Indians | Wankhede Stadium |
| CSK | Chennai Super Kings | M. A. Chidambaram Stadium |
| RCB | Royal Challengers Bangalore | M. Chinnaswamy Stadium |
| KKR | Kolkata Knight Riders | Eden Gardens |
| DC | Delhi Capitals | Arun Jaitley Stadium |
| RR | Rajasthan Royals | Sawai Mansingh Stadium |
| PBKS | Punjab Kings | IS Bindra Stadium |
| SRH | Sunrisers Hyderabad | Rajiv Gandhi International Stadium |
| GT | Gujarat Titans | Narendra Modi Stadium |
| LSG | Lucknow Super Giants | BRSABV Ekana Cricket Stadium |

---

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Scores cannot be negative` | Negative score provided | Ensure teamA and teamB scores are ≥ 0 |
| `Overs must be between 0 and 20` | Invalid overs value | Use overs between 0.0 and 20.0 (e.g., 5.3 for 5 overs 3 balls) |
| `Match ID is required` | Empty match ID | Provide a valid match ID |
| `ConditionalCheckFailedException` | Match or player doesn't exist | Verify the match exists and status is valid |
| `DB Error: Unknown Transaction Failure` | Database transaction failed | Check CloudWatch logs for details |

---

## Testing Workflow

### Scenario 1: Create and Play a Match

1. **Create a match:**
   - Use: `Create New Match`
   - Note the returned `id`

2. **Update status to LIVE:**
   - Use: `Update Match Status`
   - Set `status` to `LIVE`
   - Use the `id` from step 1

3. **Record ball events:**
   - Use: `Record Ball Event`
   - Record multiple balls with different values
   - Verify match score updates

4. **Update final score:**
   - Use: `Add/Update Match Score`
   - Set final scores for both teams

5. **Complete the match:**
   - Use: `Update Match Status`
   - Set `status` to `COMPLETED`

### Scenario 2: Query Match Information

1. **List all matches:**
   - Use: `List All Matches by Season`
   - View all matches for the season

2. **Filter by status:**
   - Use: `List Matches by Status`
   - Change `status` variable to filter

3. **Get specific match:**
   - Use: `Get Specific Match`
   - Provide exact match ID to see details

---

## CloudWatch Logging

All operations are logged to CloudWatch. Check logs with:

```bash
aws logs tail /aws/lambda/your-function-name --follow
```

Log entries include:
- Handler execution logs
- Database query details
- Match/Score updates
- Error messages with stack traces

---

## Troubleshooting

### API Returns 401/403
- Verify your API Gateway credentials
- Check AWS Lambda execution role has DynamoDB permissions

### API Returns 500
- Check CloudWatch logs for error details
- Verify all required parameters are provided
- Ensure parameter types match schema (e.g., `season` must be Int)

### Slow Response
- Initial request may take 5-10 seconds (Lambda cold start)
- Subsequent requests should be faster (<1 second)

### Data Not Updating
- Verify match exists with `Get Specific Match` first
- Check match status is valid for the operation
- Review CloudWatch logs for validation errors

---

## Notes

- All timestamps use ISO 8601 format with UTC timezone
- Match IDs are UUIDs generated by the system
- Overs format: `over.ball` (e.g., 5.3 = 5 overs 3 balls)
- Scores auto-increment in transactions
- All GraphQL operations are transactional (all or nothing)
