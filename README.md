# Actor - Kickstarter search

## Kickstarter open API

Because Kickstarter public API does not provide structured output of search results, you can get list of Kickstarter news and projects with this app (actor).

## Planned features

* Unit tests
* Compare current run with previous one and output only new projects
* Add human readable formats to dates and other values in output.

## Kickstarter open source
You can manage search results in any languague (Python, PHP, Node JS/NPM). See the FAQ or <a href="https://www.apify.com/docs/api" target="blank">our API reference</a> to learn more about getting results from this Kickstarter Search Actor.
The code of this Kickstarter search actor is also open source, so you can create your own solution if you need.

## INPUT

Input of this actor should be JSON containing filter specification. Allowed filters are:

| Field | Type | Description | Allowed values |
| ----- | ---- | ----------- | -------------- |
| query | String | Search term | Any string value |
| category | String | Category to search in | Category slug from <a href="https://github.com/gippy/kickstarter-search/blob/master/categories.json" target="_blank">this list</a> |
| location | String / Number | Location to search around | Either a name of the location or ID of the location |
| status | String | State of the project | One of: "All", "Live", "Successful" |
| pledged | String | Amount pledged | One of:<br/>"All"<br/>"< $1,000 pledged"<br/>"$1,000 to $10,000 pledged"<br/>"$10,000 to $100,000 pledged"<br/>"$100,000 to $1,000,000 pledged"<br/>"> $1,000,000 pledged" |
| goal | String | Goal amount | One of:<br/>"All"<br/>>"< $1,000 goal"<br/>"$1,000 to $10,000 goal"<br/>"$10,000 to $100,000 goal"<br/> "$100,000 to $1,000,000 goal"<br/>"> $1,000,000 goal" |
| raised | String | Amount raised | One of:<br/>"All"<br/>"< 75% raised"<br/>"75% to 100% raised"<br/>"> 100% raised" |
| sort | String | Sort order | One of: <br/>"pupularity", <br/>"newest", <br/>"end_date", <br/>"most_funded", <br/>"most_backed"|
| maxResults | Number | Maximum number of projects in output | Positive number, 0 for up to 2400 results |
| datasetName | String | Name of dataset that will be overwritten with data on each run | Alphabet characters, numbers and dash (e.q. my-dataset) |


### Important considerations
**Location** - If you provide location to the Kickstarter search actor and it's set a string, it will run <a href="https://www.apify.com/jaroslavhejlek/kickstarter-location-to-ids" target="_blank">another actor</a> to find
ID associated with the location. Once the location is found, it will be outputed in the console. Next time if you provide
the numeric ID instead of the location, it will not do the lookup again.

This option requires access to <a href="https://www.apify.com/docs/proxy">Apify Proxy</a>, if you do not have access to it, then the actor will fail.
You can avoid this by going to Kickstarter, looking up anything and selecting the location you want. Then in addressbar of your browser you should see that the address now contains "woe_id" parameter. If you copy it's value into the location field of this actor. It will use it instead and you will not need to use proxy.

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
  "id": 1293646151,
  "photo": "https://ksr-ugc.imgix.net/assets/023/084/557/b95fc7ed612431d640810da0c72b135d_original.jpg?ixlib=rb-1.1.0&crop=faces&w=560&h=315&fit=crop&v=1540944591&auto=format&frame=1&q=92&s=3d9c00ab27cc4b18fa1ba465602fefde",
  "name": "Curiously Cynical Creatures - Vinyl Stickers",
  "blurb": "I designed some animal stickers. Come get some! They will be vinyl, matte, and custom-cut.",
  "goal": 300,
  "pledged": 1.29,
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
  "backers_count": 1,
  "static_usd_rate": 0.76288474,
  "usd_pledged": "0.9841213146",
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
