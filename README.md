# Actor - Kickstarter search

Actor which takes Kickstarter search filters and outputs JSON of found results.

**This Actor requires proxy to work properly, please check that you have access to Apify Proxy, before you try to run it.**

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
| previousRun | String | ID of previous run, if provided then only new projects will be outputed | Valid ID of run on Apify platform |

TODO: Examples and explanation of location, maxResults and previousRun

## Run & Console output

TODO

## OUTPUT

TODO
