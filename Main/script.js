
function iniciarMap() {
  var centroInicial = { lat: 32.51927777777777, lng: -117.06855555555555 };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: centroInicial
  });

  fetch('https://localhost:7168/api/Contenedor')
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los contenedores");
      }
      return response.json();
    })
    .then(data => {
      data.forEach(contenedor => {
        var coord = {
          lat: contenedor.ubicacion.latitud,
          lng: contenedor.ubicacion.longitud
        };

        // Determinar color del marcador
        var iconColor = contenedor.porcentajeActual >= 80 ? 'red' : 'green';
        var markerIcon = `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`;

        var marker = new google.maps.Marker({
          position: coord,
          map: map,
          title: contenedor.nombre,
          icon: markerIcon
        });

        var infoWindow = new google.maps.InfoWindow({
          content: `<strong>${contenedor.nombre}</strong><br>Ubicación: ${contenedor.ubicacion.nombre}<br>Porcentaje actual: ${contenedor.porcentajeActual.toFixed(2)}%`
        });

        marker.addListener('click', function () {
          infoWindow.open(map, marker);
        });
      });
    })
    .catch(error => {
      console.error("Hubo un problema al cargar los contenedores:", error);
    });
}

