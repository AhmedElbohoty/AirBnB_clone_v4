document.addEventListener('DOMContentLoaded', function () {
  handleAmenitiesCheckBoxes();

  getAppStatus();
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
