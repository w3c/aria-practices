/**
 * ARIA Feed Example
 * @function onload
 * @desc Initialize the feed once the page has loaded
 */
window.addEventListener('load', function () {
  var feedNode = document.getElementById('restaurant-feed');
  var delaySelect = document.getElementById('delay-time-select');
  var restaurantFeed = new aria.Feed(
    feedNode,
    delaySelect
  );

  var restaurantFeedDisplay = new aria.FeedDisplay(
    restaurantFeed,
    function () {
      return aria.RestaurantData;
    }
  );

  restaurantFeedDisplay.setDelay(delaySelect.value);
  delaySelect.addEventListener('change', function () {
    restaurantFeedDisplay.setDelay(delaySelect.value);
  });
});
