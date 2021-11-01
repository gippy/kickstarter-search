# Actor - Kickstarter search

## Kickstarter open API

Because Kickstarter public API does not provide structured output of search results, you can get list of Kickstarter news and projects with this app (actor).

## Planned features

* Unit tests
* Compare current run with previous one and output only new projects

## Kickstarter open source
You can manage search results in any languague (Python, PHP, Node JS/NPM). See the FAQ or <a href="https://www.apify.com/docs/api" target="blank">our API reference</a> to learn more about getting results from this Kickstarter Search Actor.
The code of this Kickstarter search actor is also open source, so you can create your own solution if you need.

## INPUT

Input of this actor should be JSON containing filter specification. Allowed filters are:

| Field | Type | Description | Allowed values |
| ----- | ---- | ----------- | -------------- |
| query | String | Search term | Any string value |
| category | String | Category to search in | Category slug from <a href="https://github.com/gippy/kickstarter-search/blob/master/categories.json" target="_blank">this list</a> |
| location | String / Number | Location to search around | A name of the location |
| status | String | State of the project | One of: "All", "Live", "Successful" |
| pledged | String | Amount pledged | One of:<br/>"All"<br/>"< $1,000 pledged"<br/>"$1,000 to $10,000 pledged"<br/>"$10,000 to $100,000 pledged"<br/>"$100,000 to $1,000,000 pledged"<br/>"> $1,000,000 pledged" |
| goal | String | Goal amount | One of:<br/>"All"<br/>>"< $1,000 goal"<br/>"$1,000 to $10,000 goal"<br/>"$10,000 to $100,000 goal"<br/> "$100,000 to $1,000,000 goal"<br/>"> $1,000,000 goal" |
| raised | String | Amount raised | One of:<br/>"All"<br/>"< 75% raised"<br/>"75% to 100% raised"<br/>"> 100% raised" |
| sort | String | Sort order | One of: <br/>"pupularity", <br/>"newest", <br/>"end_date", <br/>"most_funded", <br/>"most_backed"|
| maxResults | Number | Maximum number of projects in output | Positive number, 0 for up to 2400 results |
| datasetName | String | Name of dataset that will be overwritten with data on each run | Alphabet characters, numbers and dash (e.q. my-dataset) |


### Important considerations
**Location** - If you provide location to the Kickstarter search actor and it's set a string, it will run <a href="https://www.apify.com/jaroslavhejlek/kickstarter-location-to-ids" target="_blank">another actor</a> to find
ID associated with the location. 

**maxResults** - Kickstarter will return a maximum of 200 pages, which is 2400 results. To get more results then this limit run multiple instances of this actor with more specific search terms.

**datasetName** - If you provide name of a named dataset then all everytime you run this Kickistarter search actor, it will clear the dataset and write new data into it. You can use this option for example if you want to use named dataset as RSS feed or if you are creating an API.

## Run & Console output

During the run, the actor will output messages letting the you know what is going on.

If you provide incorrect input the Kickstarter search actor, it will immediately stop with Failure state and output an explanation of
what is wrong.

Once input is properly parsed the actor will load first page of results and output information about the
number of found results and how many results are remaining.

Every 10th page load will output prediction of how long it will take for the run to finish.

## Dataset items

During the run, the actor is storing results into dataset, each project is a separate item in the dataset and it's
structure looks like this:

```json
{
  "id": 1483913924,
  "photo": "https://ksr-ugc.imgix.net/assets/023/834/770/03501faf6f2185aaa61162c6b2fa7810_original.jpg?ixlib=rb-1.1.0&crop=faces&w=560&h=315&fit=crop&v=1547938069&auto=format&frame=1&q=92&s=8ba5a9c1fd72ebc374dcd6a316643fa2",
  "name": "\"Nothing Left To Prove\" CD and Vinyl Release",
  "blurb": "This is a campaign to see a physical release for Joey Allcorn's 2013 album \"Nothing Left To Prove\"",
  "goal": 4500,
  "pledged": 318,
  "state": "live",
  "slug": "nothing-left-to-prove-cd-and-vinyl-release",
  "disable_communication": false,
  "country": "US",
  "currency": "USD",
  "currency_symbol": "$",
  "currency_trailing_code": true,
  "deadline": 1552093200,
  "state_changed_at": 1547938512,
  "created_at": 1547932710,
  "launched_at": 1547938511,
  "staff_pick": false,
  "is_starrable": true,
  "backers_count": 9,
  "static_usd_rate": 1,
  "usd_pledged": "318.0",
  "converted_pledged_amount": 318,
  "fx_rate": 1,
  "current_currency": "USD",
  "usd_type": "domestic",
  "spotlight": false,
  "creatorId": 60316774,
  "creatorName": "Joey Allcorn",
  "creatorAvatar": "https://ksr-ugc.imgix.net/assets/023/834/796/cc0be4c0a1b2353c73b2580b5179453a_original.jpg?ixlib=rb-1.1.0&w=160&h=160&fit=crop&v=1547938330&auto=format&frame=1&q=92&s=21522c8166e3d904536376c080561cc3",
  "creatorUrl": "https://www.kickstarter.com/profile/joeyallcorn",
  "locationId": 2457170,
  "locationName": "Nashville, TN",
  "categoryId": 37,
  "categoryName": "Country & Folk",
  "categorySlug": "music/country & folk",
  "url": "https://www.kickstarter.com/projects/joeyallcorn/nothing-left-to-prove-cd-and-vinyl-release?ref=category_location",
  "title": "\"Nothing Left To Prove\" CD and Vinyl Release",
  "description": "This is a campaign to see a physical release for Joey Allcorn's 2013 album \"Nothing Left To Prove\"",
  "link": "https://www.kickstarter.com/projects/joeyallcorn/nothing-left-to-prove-cd-and-vinyl-release?ref=category_location",
  "pubDate": "Sat, 19 Jan 2019 22:55:11 +0000",
  "created_at_formatted": "Sat, 19 Jan 2019 21:18:30 +0000",
  "launched_at_formatted": "Sat, 19 Jan 2019 22:55:11 +0000"
}
```
