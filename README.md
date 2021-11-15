Since the official Kickstarter API does not provide structured output of search results, you can get list of Kickstarter news and projects with this Kickstarter Scraper.

## Features

- scrape Kickstarter data up to **2400 items/per run**
- get data from the most recent projects of **any category** and from **any city** 
- search and scrape based on the amount of money **aimed for, pledged and collected**
- **sort by** status, recency or popularity
- name your Kickstarter **datasets** to keep track of all the various runs

## Why scrape Kickstarter?

[Kickstarter](https://www.kickstarter.com/) website is full of crowdfunding projects that are changing the world in many little ways. Here's what you can do with the data about them:

 - Monitor both existing and upcoming  [Kickstarter](https://www.kickstarter.com/) projects in your country or city
 - Analyze which projects are the most likely to get supported and estimate the potential for success
 - Strengthen your own crowdfunding campaign with real-time data
 - Follow the projects competing in the same category all over the country
 - Oversee your own project and [get notifications](https://apify.com/jakubbalada/content-checker) every time it gets funding 
 - Back up your Kickstarter investment analysis with the most recent data
 - Keep track and archive the past successful projects in your city

## Tutorial

For a more detailed explanation of  [how to scrape Kickstarter](https://blog.apify.com/kickstarter-search-actor-create-your-own-kickstarter-api/)  read a step-by-step tutorial on our  [blog](https://blog.apify.com/).

And for more ideas on how to use the extracted data, check out our  [industries pages](https://apify.com/industries)  for concrete ways web scraping results are already being used across businesses of various scale and direction - in  [NGO and Government work](https://apify.com/industries/ngo-and-government) or [Journalism](https://apify.com/industries/marketing-and-media), for instance.

## Cost of usage

On average, scraping  **1000 items**  from Kickstarter via Apify platform will cost you as little as  **0.03 USD credits**  off your subscription plan. For more details about the plans we offer, platform credits and usage, see the  [platform pricing page](https://apify.com/pricing/actors).

If you're not sure how much credits you've got left on your plan and whether you might need to upgrade, you can always check your limits in the  _Settings_  ->  _Usage and Billing_  tab in  [your Console](https://console.apify.com/). The easiest way to know how many credits your actor will need is to perform a test run.


## Input

Input of this actor should be JSON containing filter specification. Allowed filters are:

| **Field** | **Description** | **Allowed values** |
|--|--|--|
|  **query**| Search term | Any string value, e.g. *Nimbus 2000 project*  |
| **category** | Category to search in | Category slug from  [this list](https://github.com/gippy/kickstarter-search/blob/master/categories.json) - anything from *books* to *community gardens* |
|  **location**| Location to search around | Name of the location, e.g. *Prague* |
|  **status**| Status of the project | *All, Live *or* Successful*|
|  **pledged**| Amount pledged |One of: *All, <$1,000 pledged, $1,000 to $10,000 pledged, $10,000 to $100,000 pledged, $100,000 to $1,000,000 pledged and >$1,000,000 pledged*|
|  **goal**| Goal amount | One of: *All, <$1,000 goal, $1,000 to $10,000 goal, $10,000 to $100,000 goal, $100,000 to $1,000,000 goal and >$1,000,000 goal*|
|  **raised**| Amount % raised | One of: *All, < 5% raised, 75% to 100% raised, >100% raised*|
|  **Sort**| Sort by| Popularity,  newest,  end_date,  most_funded or  most_backed|
|  **maxResults**| Maximum number of projects in output | Has to be a positive number, from 0 to 2400 results|
|  **datasetName**| Name of dataset that will be overwritten with data on each run| Alphabet characters, numbers and dash (e.q. my-dataset)|

### Input example:

```json
{
    "query":  "Board games",  "
    maxResults":  100,  
    "category":  "games",  
    "location":  "United States",  
    "sort":  "newest",  "proxyConfig":  
    {  "useApifyProxy":  true  },  
    "status":  "Successful",  
    "pledged":  "$1,000 to $10,000 pledged",  
    "goal":  "$1,000 to $10,000 goal",  
    "raised":  "All",  
    "datasetName":  ""
}
```
### Important considerations 

 - **maxResults**  - Kickstarter website can return a maximum of 200 pages, so at most, you will get 2400 results for any query. To get over 2400 results, run multiple instances of this actor with more specific search terms.

 - **datasetName** - If you provide name to a named dataset, every time you run this Kickstarter search actor, it will clear the existing dataset and rewrite it with new data. You can use this option if you want to use named dataset as RSS feed or if you are creating an API.

 - **Location**  - You can also run another actor [Kickstarter Location To Ids](https://www.apify.com/jaroslavhejlek/kickstarter-location-to-ids)  to find the specific ID associated with the location.


## During the run 

During the run, the actor will output messages letting the you know what is going on. If you provide incorrect input the Kickstarter search actor, it will immediately stop with *Failure* state and output an explanation of what is wrong.


## Output 

Once input is properly parsed the actor will load first page of results and output information about the number of found results and how many results are remaining. Every 10th page load will output prediction of how long it will take for the run to finish.

### Output example
```json
{  
"id":  1662550845,  
"photo":  null,  
"name":  "Escape from HelL",  
"blurb":  "A board game about getting to Manhattan from Williamsburg once the L train shuts down.",  
"goal":  2500,  
"pledged":  7580,  
"state":  "successful",  
"slug":  "escape-from-hell",  
"disable_communication":  false,  
"country":  "US",  
"country_displayable_name":  "the United States",  
"currency":  "USD",  
"currency_symbol":  "$",  
"currency_trailing_code":  true,  
"deadline":  1547854200,  
"state_changed_at":  1547854200,  
"created_at":  1543533003,  
"launched_at":  1545138257,  
"staff_pick":  false,  
"is_starrable":  false,  
"backers_count":  195,  
"static_usd_rate":  1,  
"usd_pledged":  "7580.0",  
"converted_pledged_amount":  7580,  
"fx_rate":  1,  
"usd_exchange_rate":  1,  
"current_currency":  "USD",  
"usd_type":  "international",  
"spotlight":  true,  
"creatorId":  696946511,  
"creatorName": "Escape from Hell",  
"creatorAvatar": "https://ksr-ugc.imgix.net/assets/023/572/288/d31afa951de00ed08ad0c8876cfbb0f2_original.png?ixlib=rb-4.0.2&w=160&h=160&fit=crop&v=1544981648&auto=format&frame=1&q=92&s=c7c176c48efa1a78213c52d58f7b5b98",  
"creatorUrl":  "https://www.kickstarter.com/profile/escapefromhell",  
},
```


## Kickstarter open source

You can manage search results in any language (Python, PHP, Node JS/NPM). See the FAQ or  [our API reference](https://www.apify.com/docs/api)  to learn more about getting results from this Kickstarter Search Actor. The code of this Kickstarter search actor is also open source, so you can create your own solution if you need.
