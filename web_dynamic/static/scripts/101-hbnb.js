document.addEventListener("DOMContentLoaded", function () {
  // App state
  const amenities = {};
  const states = {};
  const cities = {};

  // Function calls
  handleAmenitiesCheckBoxes();

  handleStatesCheckBoxes();

  handleCitiesCheckBoxes();

  getAppStatus();

  getPlaces();

  searchPlacesByAmenities();

  // Function declaration
  function getAppStatus() {
    const apiStatus = $("#api_status");
    $.getJSON("http://0.0.0.0:5001/api/v1/status/", (data) => {
      if (data.status === "OK") {
        apiStatus.addClass("available");
      } else {
        apiStatus.removeClass("available");
      }
    });
  }

  function handleAmenitiesCheckBoxes() {
    $(".amenity-checkbox").on("change", onChange);

    function onChange(e) {
      const h4 = $(".amenities-h4");

      const input = e.currentTarget;
      const id = input.dataset.id;
      const name = input.dataset.name;

      if (input.checked) {
        amenities[name] = id;
      } else {
        delete amenities[name];
      }

      const text = Object.keys(amenities).sort().join(", ");
      h4.text(text);
    }
  }

  function handleStatesCheckBoxes() {
    $(".state-checkbox").on("change", onChange);

    function onChange(e) {
      const h4 = $(".locations-h4");

      const input = e.currentTarget;
      const id = input.dataset.id;
      const name = input.dataset.name;

      if (input.checked) {
        states[id] = name;
      } else {
        delete states[id];
      }

      const text = Object.values(states).sort().join(", ");
      h4.text(text);
    }
  }

  function handleCitiesCheckBoxes() {
    $(".city-checkbox").on("change", onChange);

    function onChange(e) {
      const h4 = $(".locations-h4");

      const input = e.currentTarget;
      const id = input.dataset.id;
      const name = input.dataset.name;

      if (input.checked) {
        cities[id] = name;
      } else {
        delete cities[id];
      }

      const text = Object.values(cities).sort().join(", ");
      h4.text(text);
    }
  }

  function getPlaces(amenities = {}, states = {}, cities = {}) {
    const url = "http://0.0.0.0:5001/api/v1/places_search";
    const dataType = "json";

    const amenitiesIds = Object.values(amenities);
    const statesIds = Object.keys(states);
    const citiesIds = Object.keys(cities);
    const data = JSON.stringify({
      amenities: amenitiesIds,
      states: statesIds,
      cities: citiesIds,
    });
    const headers = {
      "Content-Type": "application/json",
    };

    $.post({
      url,
      data,
      headers,
      dataType,
      success: (data) => {
        $(".places").empty();

        data.forEach((place) => {
          // Title box
          const titleBox = $("<div>")
            .addClass("title_box")
            .append(
              $("<h2>").text(place.name),
              $("<div>")
                .addClass("price_by_night")
                .text("$" + place.price_by_night)
            );

          // Information
          const guest = $("<div>")
            .addClass("max_guest")
            .text(
              place.max_guest + " Guest" + (place.max_guest !== 1 ? "s" : "")
            );

          const bedrooms = $("<div>")
            .addClass("number_rooms")
            .text(
              place.number_rooms +
                " Bedroom" +
                (place.number_rooms !== 1 ? "s" : "")
            );

          const bathrooms = $("<div>")
            .addClass("number_bathrooms")
            .text(
              place.number_bathrooms +
                " Bathroom" +
                (place.number_bathrooms !== 1 ? "s" : "")
            );

          const information = $("<div>")
            .addClass("information")
            .append(guest, bedrooms, bathrooms);

          // Description
          const description = $("<div>")
            .addClass("description")
            .text(place.description);

          // Reviews
          const article = $("<article>").append(
            titleBox,
            information,
            description,
            `<div class="reviews" data-place="${place.id}">
              <h2 class="reviews-h2"></h2>
              <ul class="reviews-ul reviews-ul-hide"></ul>
            </div>`
          );

          $(".places").append(article);

          getReviews(place.id);
        });
      },
      error: (error) => console.log(error),
    });
  }

  function searchPlacesByAmenities() {
    $(".filters button").on("click", () => {
      getPlaces(amenities, states, cities);
    });
  }

  function getReviews(placeId) {
    const url = `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`;
    const dataType = "json";
    const headers = {
      "Content-Type": "application/json",
    };

    $.get({
      url,
      dataType,
      headers,
      success: (data) => {
        const h2 = $(`.reviews[data-place="${placeId}"] h2`);
        const ul = $(`.reviews[data-place="${placeId}"] ul`);

        const span = $("<span>").addClass("show-reviews").text("show");
        h2.text(`${data.length} Reviews `).append(span);

        span.on("click", onClickShow);

        function onClickShow() {
          if (ul.hasClass("reviews-ul-hide")) {
            span.text("hide");

            data.forEach((r) => {
              const url = `http://0.0.0.0:5001/api/v1/users/${r.user_id}`;

              $.get({
                url,
                dataType,
                success: (user) => {
                  const userName = user.first_name + " " + user.last_name;
                  const date = r.created_at;

                  const li = $("<li>");
                  const h3 = $("<h3>")
                    .addClass("review-h3")
                    .text(`From ${userName} the ${date}`);
                  const p = $("p").text(r.text);

                  li.append(h3);
                  li.append(p);

                  ul.append(li);
                },
              });
            });
          } else {
            ul.empty();
            span.text("show");
          }

          ul.toggleClass("reviews-ul-hide");
        }
      },
    });
  }
});
