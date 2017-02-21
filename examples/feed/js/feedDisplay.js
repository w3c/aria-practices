/**
 * @namespace aria
 */
var aria = aria || {};

aria.RestaurantData = [
  {
    name: "Tito's Tacos",
    rating: 5,
    type: "Mexican, Tacos",
    street: '123 Blueberry Ln',
    citystate: "San Dimas, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "Sakura Sushi",
    rating: 4,
    type: "Japanese, Fish, Sushi",
    street: '123 Blueberry Ln',
    citystate: "Pomona, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "Prime Steakhouse",
    rating: 4,
    type: "Steakhouses",
    street: '123 Blueberry Ln',
    citystate: "Claremont, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "The Pizza Factory",
    rating: 4,
    type: "Pizza",
    street: '123 Blueberry Ln',
    citystate: "Pomona, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "Emperor's Mongolian",
    rating: 5,
    type: "Mongolian, Barbequeue, Buffets",
    street: '123 Blueberry Ln',
    citystate: "La Verne, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "Backyard Grill",
    rating: 3,
    type: "American, Burgers",
    street: '123 Blueberry Ln',
    citystate: "San Dimas, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "Taste Kitchen",
    rating: 4,
    type: "American",
    street: '123 Blueberry Ln',
    citystate: "Claremont, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "Bon Appetit",
    rating: 4,
    type: "French",
    street: '123 Blueberry Ln',
    citystate: "La Verne, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "Sally's Sandwiches",
    rating: 3,
    type: "Sandwiches, American",
    street: '123 Blueberry Ln',
    citystate: "San Dimas, CA",
    phone: "(111) 111-1111",
    image: "",
  },
  {
    name: "The HotPot Spot",
    rating: 5,
    type: "Hot Pot, Japanese",
    street: '123 Blueberry Ln',
    citystate: "Pomona, CA",
    phone: "(111) 111-1111",
    image: "",
  },
];

aria.FeedDisplay = function (feedNode, fetchData) {
  this.feedNode = feedNode;
  this.fetchData = fetchData;
  this.currentPage = 0;
  this.perPage = 10;
  this.currentIndex = 0;
  this.loadData();
};

aria.FeedDisplay.prototype.loadData = function () {
  var feedData = this.fetchData(this.currentPage, this.perPage);

  if (!this.feedNode) {
    return;
  }

  Array.prototype.forEach.call(feedData, (function (itemData) {
    this.feedNode.appendChild(this.renderItemData(itemData));
  }).bind(this));

  // TODO: update aria-setsize for all elements
};

aria.FeedDisplay.prototype.renderItemData = function (itemData) {
  var feedItem = document.createElement('div');

  this.currentIndex++;

  feedItem.setAttribute('role', 'article');
  feedItem.className = 'restaurant-item';
  feedItem.setAttribute('aria-labelledby', 'feed-name-' + this.currentIndex);
  feedItem.setAttribute('aria-posinset', this.currentIndex);
  feedItem.setAttribute('tabindex', '0');

  var itemDetails = document.createElement('div');
  itemDetails.className = 'restaurant-details';
  var itemContent = '';

  if (itemData.image) {
    itemContent += '<div class="restaurant-image">'
                   + itemData.image
                   + '</div>';
  }

  itemContent += '<div class="restaurant-name" '
                 + 'id="feed-name-' + this.currentIndex + '">'
                 + itemData.name
                 + '</div>';

  if (itemData.rating) {
    itemContent += '<div class="restaurant-rating">'
                   + '<img class="restaurant-star-img" '
                   + 'alt="' + itemData.rating + ' stars" '
                   + 'src="imgs/rating-' + itemData.rating + '.png" />'
                   + '</div>';
  }

  if (itemData.type) {
    itemContent += '<div class="restaurant-type">'
                   + itemData.type
                   + '</div>';
  }

  itemDetails.innerHTML = itemContent;
  feedItem.appendChild(itemDetails);

  var locationBlock = document.createElement('div');
  locationBlock.className = 'location-block';
  var locationContent = '';

  if (itemData.street) {
    locationContent += '<div class="restaurant-street">'
                   + itemData.street
                   + '</div>';
  }

  if (itemData.citystate) {
    locationContent += '<div class="restaurant-citystate">'
                   + itemData.citystate
                   + '</div>';
  }

  if (itemData.phone) {
    locationContent += '<div class="restaurant-phone">'
                   + itemData.phone
                   + '</div>';
  }

  locationBlock.innerHTML = locationContent;
  feedItem.appendChild(locationBlock);

  var actions = document.createElement('div');
  actions.className = 'restaurant-actions';
  actions.innerHTML = '<button class="bookmark-button">Bookmark</button>';
  feedItem.appendChild(actions);

  return feedItem;
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
