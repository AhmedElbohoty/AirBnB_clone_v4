document.addEventListener("DOMContentLoaded", function () {
  const amenities = {};
  $(".amenity-checkbox").change(onChange);

  function onChange(e) {
    const h4 = $(".amenities-h4");
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;

    if (this.checked) {
      amenities[name] = id;
    } else {
      delete amenities[name];
    }

    const text = Object.keys(amenities).sort().join(", ");
    h4.text(text);
  }
});
