document.addEventListener('DOMContentLoaded', function () {
  handleAmenitiesCheckBoxes();

  getAppStatus();

  getAllPlaces();
});

function handleAmenitiesCheckBoxes () {
  const amenities = {};
  $('.amenity-checkbox').change(onChange);

  function onChange (e) {
    const h4 = $('.amenities-h4');

    const input = e.currentTarget;
    const id = input.dataset.id;
    const name = input.dataset.name;

    if (input.checked) {
      amenities[name] = id;
    } else {
      delete amenities[name];
    }

    const text = Object.keys(amenities).sort().join(', ');
    h4.text(text);
  }
}

function getAppStatus () {
  const apiStatus = $('#api_status');
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      apiStatus.addClass('available');
    } else {
      apiStatus.removeClass('available');
    }
  });
}

function getAllPlaces () {
  const url = 'http://0.0.0.0:5001/api/v1/places_search';
  const dataType = 'json';
  const data = JSON.stringify({});
  const headers = {
    'Content-Type': 'application/json'
  };

  $.post({
    url,
    data,
    headers,
    dataType,
    success: (data) => {
      data.forEach((place) => {
        const placesSection = $('.places');

        // Title box
        const titleBox = $('<div>')
          .addClass('title_box')
          .append(
            $('<h2>').text(place.name),
            $('<div>')
              .addClass('price_by_night')
              .text('$' + place.price_by_night)
          );

        // Information
        const guest = $('<div>')
          .addClass('max_guest')
          .text(
            place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '')
          );

        const bedrooms = $('<div>')
          .addClass('number_rooms')
          .text(
            place.number_rooms +
              ' Bedroom' +
              (place.number_rooms !== 1 ? 's' : '')
          );

        const bathrooms = $('<div>')
          .addClass('number_bathrooms')
          .text(
            place.number_bathrooms +
              ' Bathroom' +
              (place.number_bathrooms !== 1 ? 's' : '')
          );

        const information = $('<div>')
          .addClass('information')
          .append(guest, bedrooms, bathrooms);

        // Description
        const description = $('<div>')
          .addClass('description')
          .text(place.description);

        const article = $('<article>').append(
          titleBox,
          information,
          description
        );

        $('.places').append(article);
      });
    },
    error: (error) => console.log(error)
  });
}
