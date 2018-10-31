# Actor - Kickstarter search

Actor which takes Kickstarter search filters and outputs JSON of found results.

## Planned features

0) Unit tests
1) Compare current run with previous one and output only new projects
2) Concurrently load more pages at the same time to speed up project loading

## INPUT

Input of this actor should be JSON containing filter specification. Allowed filters are:

| Field | Type | Description | Allowed values |
| ----- | ---- | ----------- | -------------- |
| query | String | Search term | Any string value |
| category | String | Category to search in | Category slug from this list |
| location | String / Number | Location to search around | Either a name of the location or ID of the location |
| status | String | State of the project | One of: "All", "Live", "Successful" |
| pledged | String | Amount pledged | One of:<br>"All"<br>"< $1,000 pledged"<br>"$1,000 to $10,000 pledged"<br>"$10,000 to $100,000 pledged"<br>"$100,000 to $1,000,000 pledged"<br>"> $1,000,000 pledged" |
| goal | String | Goal amount | One of:<br>"All"<br>"< $1,000 goal"<br>"$1,000 to $10,000 goal"<br>"$10,000 to $100,000 goal"<br> "$100,000 to $1,000,000 goal"<br>"> $1,000,000 goal" |
| raised | String | Amount raised | One of:<br>"All"<br>"< 75% raised"<br>"75% to 100% raised"<br>"> 100% raised" |
| maxResults | Number | Maximum number of projects in output | Positive number, 0 for all results |

### Important considerations
**Location** - If you provide location to the Actor and it's set a string, it will run another actor to find
ID associated with the location. Once the location is found, it will be outputed in the console. Next time if you provide
the numeric ID instead of the location, it will not do the lookup again.

**maxResults** - Kickstarter will return a maximum of 200 pages, which is 2400 results. To get more results then this limit run multiple instances of this actor with more specific search terms.

## Run & Console output

During the run, the actor will output messages letting the user know what is going on.

If you provide incorrect input the actor will immediately stop with Failure state and output an explanation of
what is wrong.

Once input is properly parsed the actor will load first page of results and output information about the
number of found results and how many results are remaining.

Every 10th page load will output prediction of how long it will take for the run to finish.

## Dataset

During the run, the actor is storing results into dataset, each project is a seperate item in dataset and it's
structure looks like this:

```json
{
  "id": 1293646151,
  "name": "Curiously Cynical Creatures - Vinyl Stickers",
  "blurb": "I designed some animal stickers. Come get some! They will be vinyl, matte, and custom-cut.",
  "goal": 300,
  "pledged": 0,
  "state": "live",
  "slug": "curiously-cynical-creatures-vinyl-stickers",
  "disable_communication": false,
  "country": "CA",
  "currency": "CAD",
  "currency_symbol": "$",
  "currency_trailing_code": true,
  "deadline": 1542754904,
  "state_changed_at": 1541023304,
  "created_at": 1540916119,
  "launched_at": 1541023304,
  "staff_pick": false,
  "is_starrable": true,
  "backers_count": 0,
  "static_usd_rate": 0.76288474,
  "usd_pledged": "0.0",
  "converted_pledged_amount": 0,
  "fx_rate": 0.76190766,
  "current_currency": "USD",
  "usd_type": "international",
  "spotlight": false,
  "creatorId": 440287730,
  "creatorName": "Compass",
  "creatorAvatar": "https://ksr-ugc.imgix.net/assets/023/078/718/07ea342826b1142d8ccbd60a5b138270_original.png?ixlib=rb-1.1.0&w=160&h=160&fit=crop&v=1540915675&auto=format&frame=1&q=92&s=45989ef82bbf1f5e4f9d28047558689c",
  "creatorUrl": "https://www.kickstarter.com/profile/440287730",
  "locationId": 22664159,
  "locationName": "Mississauga, Canada",
  "categoryId": 21,
  "categoryName": "Digital Art",
  "categorySlug": "art/digital art",
  "url": "https://www.kickstarter.com/projects/440287730/curiously-cynical-creatures-vinyl-stickers?ref=category_newest"
}
```
