/**
 * @namespace aria
 */
var aria = aria || {};

aria.RestaurantData = [
  {
    name: "Tito's Tacos",
    rating: 5,
    type: "Mexican, Tacos",
    location: "San Dimas, CA",
    image: "",
  },
  {
    name: "Sakura Sushi",
    rating: 4,
    type: "Japanese, Fish, Sushi",
    location: "Pomona, CA",
    image: "",
  },
  {
    name: "Prime Steakhouse",
    rating: 4,
    type: "Steakhouses",
    location: "Claremont, CA",
    image: "",
  },
  {
    name: "The Pizza Factory",
    rating: 4,
    type: "Pizza",
    location: "Pomona, CA",
    image: "",
  },
  {
    name: "Emperor's Mongolian",
    rating: 5,
    type: "Mongolian, Barbequeue, Buffets",
    location: "La Verne, CA",
    image: "",
  },
  {
    name: "Backyard Grill",
    rating: 3,
    type: "American, Burgers",
    location: "San Dimas, CA",
    image: "",
  },
  {
    name: "Taste Kitchen",
    rating: 4,
    type: "American",
    location: "Claremont, CA",
    image: "",
  },
  {
    name: "Bon Appetit",
    rating: 4,
    type: "French",
    location: "La Verne, CA",
    image: "",
  },
  {
    name: "Sally's Sandwiches",
    rating: 3,
    type: "Sandwiches, American",
    location: "San Dimas, CA",
    image: "",
  },
  {
    name: "The HotPot Spot",
    rating: 5,
    type: "Hot Pot, Japanese",
    location: "Pomona, CA",
    image: "",
  },
];

aria.FeedDisplay = function (feedNode, fetchData) {
  this.feedNode = feedNode;
  this.fetchData = fetchData;
  this.currentPage = 0;
  this.perPage = 10;
  this.loadData();
};

aria.FeedDisplay.prototype.loadData = function () {
  var feedData = this.fetchData(this.currentPage, this.perPage);

  if (!this.feedNode) {
    return;
  }

  Array.prototype.forEach.call(feedData, (function (itemData) {
    var feedItem = document.createElement('div');

    feedItem.setAttribute('role', 'article');
    feedItem.innerText = itemData.name;

    this.feedNode.append(feedItem);
  }).bind(this));
};

/**
 * ARIA Feed Display
 * @function onload
 * @desc Initialize the feed once the page has loaded
 */
window.addEventListener('load', function () {
  var feedNode = document.getElementById('restaurant-feed');
  var restaurantFeed = new aria.FeedDisplay(feedNode, function () {
    return aria.RestaurantData;
  });
});
