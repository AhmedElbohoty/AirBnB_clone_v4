document.addEventListener('DOMContentLoaded', function () {
    handleAmenitiesCheckBoxes();
  
    getAppStatus();

    getAppSearch();
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
    const apiStatus = $('div#api_status');
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
      if (data.status === 'OK') {
        apiStatus.addClass('available');
      } else {
        apiStatus.removeClass('available');
      }
    });
  }
// Here we made an post request using ajax
$.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    dataType: 'json',
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    success: function (places) {
      for (let i = 0; i < places.length; i++) {
        $('.places').append(`<article>
  <div class="title_box">
  <h2> ${places[i].name}</h2>
  <div class="price_by_night"> ${places[i].price_by_night} </div>
  </div>
  <div class="information">
  <div class="max_guest">${places[i].max_guest}
  ${places[i].max_guest > 1 ? 'Guests' : 'Guest'} </div>
  <div class="number_rooms">${places[i].number_rooms}
  ${places[i].number_rooms > 1 ? 'Bedrooms' : 'Bedroom'}  </div>
  <div class="number_bathrooms">${places[i].number_bathrooms}
  ${places[i].number_bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}  </div>
  </div>
  <div class="user">
  </div>
  <div class="description">
  ${places[i].description}
  </div>
  </article>
  `);
      }
    },
    error: function (xhr, status) {
      console.log('error ' + status);
    }
  });  
