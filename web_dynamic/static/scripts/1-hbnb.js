document.addEventListener('DOMContentLoaded', function () {
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
});
