class MapWrapper {
  constructor(mapElementId, options) {
    this.map = new google.maps.Map(document.getElementById(mapElementId), options);
  }

  setCenter(location) {
    this.map.setCenter(location);
  }

  setZoom(zoomLevel) {
    this.map.setZoom(zoomLevel);
  }
}

class MarkerWrapper {
  constructor(map, anchorPoint) {
    this.marker = new google.maps.Marker({
      map: map,
      anchorPoint: anchorPoint,
    });
  }

  setPosition(location) {
    this.marker.setPosition(location);
  }

  setVisible(isVisible) {
    this.marker.setVisible(isVisible);
  }
}

class InfoWindowWrapper {
  constructor(contentElement) {
    this.infoWindow = new google.maps.InfoWindow();
    this.infoWindow.setContent(contentElement);
  }

  open(map, marker) {
    this.infoWindow.open(map, marker);
  }

  close() {
    this.infoWindow.close();
  }
}

function withPlaceChangeListener(callback) {
  return (mapInstance, inputElement, infoWindow, marker) => {
    const autocomplete = new google.maps.places.Autocomplete(inputElement, {
      fields: ["formatted_address", "geometry", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      infoWindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        mapInstance.setCenter(place.geometry.viewport);
      } else {
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      infoWindow.setContent([place.name, place.formatted_address]); // Update content directly
      infoWindow.open(mapInstance.map, marker);

      callback(place); // Pass place object to the callback function
    });
  };
}

const mapElement = document.getElementById("map");
const mapOptions = {
  center: { lat: 40.749933, lng: -73.98633 },
  zoom: 13,
  mapTypeControl: false,
};

const mapWrapper = new MapWrapper(mapElement, mapOptions);
const inputElement = document.getElementById("pac-input");
const infoWindowContentElement = document.getElementById("infowindow-content");
const markerWrapper = new MarkerWrapper(mapWrapper.map, new google.maps.Point(0, -29));
const infoWindowWrapper = new InfoWindowWrapper(infoWindowContentElement);

// Decorate the initMap function with place change listener
const decoratedInitMap = withPlaceChangeListener((place) => {
  console.log("Place details:", place); // Use the place object here
});

decoratedInitMap(mapWrapper, inputElement, infoWindowWrapper, markerWrapper);
