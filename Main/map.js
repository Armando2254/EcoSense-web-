function iniciarMap() {
  var centroInicial = { lat: 32.51927777777777, lng: -117.06855555555555 };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: centroInicial
  });

  fetch(window.settings.apiUrl + 'Contenedor')
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
          // Rellenar título
          document.getElementById('modalNombre').textContent = contenedor.nombre;
          document.getElementById('modalPorcentaje').textContent = contenedor.porcentajeActual.toFixed(2);
          document.getElementById('modalUbicacion').textContent = contenedor.ubicacion.nombre;
          document.getElementById('modalLatitud').textContent = contenedor.ubicacion.latitud;
          document.getElementById('modalLongitud').textContent = contenedor.ubicacion.longitud;

          // Inyectar SVG según porcentaje
          document.getElementById('modalSvg').innerHTML = getSvgForPercentage(contenedor.porcentajeActual);

          // Mostrar modal
          document.getElementById('modalContenedor').style.display = 'flex';

          // Guardar ID en botón vaciar
          document.getElementById('btnVaciar').dataset.id = contenedor.id;
        });
      });
    })
    .catch(error => {
      console.error("Hubo un problema al cargar los contenedores:", error);
    });

  // Cerrar
  document.getElementById('btnCerrarModal').addEventListener('click', () => {
    document.getElementById('modalContenedor').style.display = 'none';
  });

  // Vaciar
  document.getElementById('btnVaciar').addEventListener('click', () => {
    const id = document.getElementById('btnVaciar').dataset.id;
    fetch(window.settings.apiUrl + `Contenedor/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ porcentajeActual: 0 }),
    })
      .then(response => {
        if (response.ok) {
          alert('Contenedor vaciado exitosamente');
          document.getElementById('modalContenedor').style.display = 'none';
          // Aquí podrías refrescar marcadores si quieres
        } else {
          alert('Error al vaciar el contenedor');
        }
      })
      .catch(error => {
        console.error('Error al vaciar:', error);
      });
  });
}

// Devuelve el SVG adecuado como string según el porcentaje
function getSvgForPercentage(pct) {
  if (pct < 20) {
    // 0% - 19%
    return `
    <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="bin-shape">
        <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z"/>
      </clipPath>
      <rect x="16" y="40" width="32" height="10" fill="#6cc24a" clip-path="url(#bin-shape)"/>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="#ccc" stroke="black" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="6" rx="2" fill="#bbb" stroke="black" stroke-width="2"/>
      <path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="black" stroke-width="2"/>
      <path d="M26 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  } else if (pct < 40) {
    // 20% - 39%
    return `
    <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clip-bin">
          <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z"/>
        </clipPath>
      </defs>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="#ccc"/>
      <rect x="16" y="40" width="32" height="12" fill="#6cc24a" clip-path="url(#clip-bin)"/>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="none" stroke="black" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="6" rx="2" fill="#bbb" stroke="black" stroke-width="2"/>
      <path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="black" stroke-width="2"/>
      <path d="M26 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  } else if (pct < 60) {
    // 40% - 59%
    return `
    <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clip-bin">
          <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z"/>
        </clipPath>
      </defs>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="#ccc"/>
      <path d="M18 53 L46 53 L47.25 35 L16.75 35 Z" fill="#FFCC00" clip-path="url(#clip-bin)"/>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="none" stroke="black" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="6" rx="2" fill="#bbb" stroke="black" stroke-width="2"/>
      <path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="black" stroke-width="2"/>
      <path d="M26 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  } else if (pct < 80) {
    // 60% - 79%
    return `
    <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clip-bin">
          <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z"/>
        </clipPath>
      </defs>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="#ccc"/>
      <path d="M17 53 L47 53 L48.5 30 L15.5 30 Z" fill="#FFD621" clip-path="url(#clip-bin)"/>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="none" stroke="black" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="6" rx="2" fill="#bbb" stroke="black" stroke-width="2"/>
      <path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="black" stroke-width="2"/>
      <path d="M26 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  } else if (pct < 90) {
    // 80% - 89.999
    return `
    <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clip-bin">
          <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z"/>
        </clipPath>
      </defs>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="#ccc"/>
      <path d="M17 53 L47 53 L48.5 17 L15.5 17 Z" fill="#FF4C00" clip-path="url(#clip-bin)"/>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="none" stroke="black" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="6" rx="2" fill="#bbb" stroke="black" stroke-width="2"/>
      <path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="black" stroke-width="2"/>
      <path d="M26 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  } else {
    // 90% - 100%
    return `
    <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clip-bin">
          <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z"/>
        </clipPath>
      </defs>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="#ccc"/>
      <path d="M17 53 L47 53 L48.5 17 L15.5 17 Z" fill="#FF2121" clip-path="url(#clip-bin)"/>
      <path d="M16 16h32l-3 34a3 3 0 0 1-3 2.7H22a3 3 0 0 1-3-2.7L16 16z" fill="none" stroke="black" stroke-width="2"/>
      <rect x="14" y="12" width="36" height="6" rx="2" fill="#FF2121" stroke="black" stroke-width="2"/>
      <path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="black" stroke-width="2"/>
      <path d="M26 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 24q0 12 0 24" stroke="black" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }
}

window.initMap = iniciarMap;