
function iniciarMap() {
  var centroInicial = { lat: 32.51927777777777, lng: -117.06855555555555 };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: centroInicial
  });

  fetch(window.settings.apiUrl+'Contenedor')
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

        var iconColor = contenedor.porcentajeActual >= 80 ? 'red' : 'green';
        var markerIcon = `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`;

        var marker = new google.maps.Marker({
          position: coord,
          map: map,
          title: contenedor.nombre,
          icon: markerIcon
        });

        marker.addListener('click', function () {
          // Abrir modal y llenar info
          document.getElementById('modalNombre').textContent = contenedor.nombre;
          document.getElementById('modalPorcentaje').textContent = contenedor.porcentajeActual.toFixed(2);
          document.getElementById('modalUbicacion').textContent = contenedor.ubicacion.nombre;
          document.getElementById('modalLatitud').textContent = contenedor.ubicacion.latitud;
          document.getElementById('modalLongitud').textContent = contenedor.ubicacion.longitud;

          // Mostrar modal
          document.getElementById('modalContenedor').style.display = 'flex';

          // Guardar ID en botón vaciar para usar luego
          document.getElementById('btnVaciar').dataset.id = contenedor.id;
        });
      });
    })
    .catch(error => {
      console.error("Hubo un problema al cargar los contenedores:", error);
    });

  // Botón cerrar
  document.getElementById('btnCerrarModal').addEventListener('click', () => {
    document.getElementById('modalContenedor').style.display = 'none';
  });

  // Botón vaciar
  document.getElementById('btnVaciar').addEventListener('click', () => {
    const id = document.getElementById('btnVaciar').dataset.id;
    // Aquí llamas a la API para vaciar el contenedor
    fetch(window.settings.apiUrl+`Contenedor/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ porcentajeActual: 0 }),
    })
    .then(response => {
      if(response.ok){
        alert('Contenedor vaciado exitosamente');
        document.getElementById('modalContenedor').style.display = 'none';
        // Opcional: actualizar mapa o recargar datos
      } else {
        alert('Error al vaciar el contenedor');
      }
    })
    .catch(error => {
      console.error('Error al vaciar:', error);
    });
  });
}


window.initMap = iniciarMap;