/**
 * script.js - Destinos del Mundo
 * - Filtros de la tabla de destinos (destinos.html)
 * - Validación y guardado de los formularios de reserva y contacto
 * - Selección automática del destino al pulsar "Reservar"
 */
document.addEventListener('DOMContentLoaded', () => {

  // Quita tildes y pasa a minúsculas para comparar textos ("América" == "america")
  const normalizar = (texto) =>
    texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  // ---------- Fecha mínima: hoy ----------
  const d = new Date();
  const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  document.querySelectorAll('input[type="date"]').forEach((input) => { input.min = hoy; });

  // ---------- Guardar datos en el navegador (localStorage) ----------
  function guardar(clave, datos) {
    try {
      const lista = JSON.parse(localStorage.getItem(clave) || '[]');
      lista.push({ ...datos, creado: new Date().toISOString() });
      localStorage.setItem(clave, JSON.stringify(lista));
    } catch (error) {
      console.warn('No se pudo guardar en localStorage:', error);
    }
  }

  // Recoge los valores de todos los campos del formulario que tengan id
  function leerCampos(form) {
    const datos = {};
    form.querySelectorAll('input, select, textarea').forEach((campo) => {
      if (!campo.id) return;
      datos[campo.id] = campo.type === 'checkbox' ? campo.checked : campo.value;
    });
    return datos;
  }

  // Valida con Bootstrap, guarda y muestra el aviso de éxito
  function gestionarFormulario(form, aviso, clave, mensaje, alTerminar) {
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        const primero = form.querySelector(':invalid');
        if (primero) primero.focus();
        return;
      }
      guardar(clave, leerCampos(form));
      aviso.textContent = mensaje;
      aviso.classList.remove('d-none');
      form.reset();
      form.classList.remove('was-validated');
      if (alTerminar) alTerminar();
    });
  }

  // ---------- Formulario de reserva rápida (modal, está en todas las páginas) ----------
  const modalReserva = document.getElementById('modalReservaRapida');
  const formReserva = document.getElementById('formReserva');
  const avisoReserva = document.getElementById('avisoReserva');

  if (modalReserva && formReserva && avisoReserva) {
    gestionarFormulario(formReserva, avisoReserva, 'reservas',
      '¡Reserva enviada! Te contactaremos por email para confirmarla.',
      () => {
        setTimeout(() => {
          const instancia = bootstrap.Modal.getInstance(modalReserva);
          if (instancia) instancia.hide();
        }, 2000);
      });

    // Al abrir el modal, preselecciona el destino desde el que se pulsó "Reservar"
    modalReserva.addEventListener('show.bs.modal', (evento) => {
      const boton = evento.relatedTarget;
      if (!boton) return;
      let destino = '';
      const fila = boton.closest('tr');
      const modalOferta = boton.closest('.modal');
      if (fila) {
        destino = fila.cells[0].firstChild.textContent;
      } else if (modalOferta) {
        const titulo = modalOferta.querySelector('.modal-title');
        if (titulo) destino = titulo.textContent.replace(/^Oferta:\s*/, '');
      }
      if (!destino) return;
      const select = document.getElementById('destinoReserva');
      const opcion = [...select.options].find((o) => normalizar(o.text) === normalizar(destino));
      if (opcion) select.value = opcion.value || opcion.text;
    });

    // Al cerrar el modal se limpia todo
    modalReserva.addEventListener('hidden.bs.modal', () => {
      avisoReserva.classList.add('d-none');
      formReserva.reset();
      formReserva.classList.remove('was-validated');
    });
  }

  // ---------- Formulario de contacto (contactos.html) ----------
  const formContacto = document.getElementById('formContacto');
  const avisoContacto = document.getElementById('avisoContacto');
  if (formContacto && avisoContacto) {
    gestionarFormulario(formContacto, avisoContacto, 'mensajes',
      '¡Mensaje enviado! Te responderemos lo antes posible.',
      () => {
        avisoContacto.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => avisoContacto.classList.add('d-none'), 6000);
      });
  }

  // ---------- Filtros de destinos (destinos.html) ----------
  const filas = [...document.querySelectorAll('table tbody tr[data-tipo]')];
  const filtroTipo = document.getElementById('filtroTipo');
  const filtroContinente = document.getElementById('filtroContinente');
  const filtroPrecio = document.getElementById('filtroPrecio');
  const botonBuscar = document.getElementById('btnBuscar');
  const contador = document.getElementById('contadorResultados');
  const sinResultados = document.getElementById('sinResultados');

  if (filas.length && filtroTipo && filtroContinente && filtroPrecio) {
    const filtrar = () => {
      const tipo = normalizar(filtroTipo.value);
      const continente = normalizar(filtroContinente.value);
      const precioMax = Number(filtroPrecio.value) || Infinity;
      let visibles = 0;

      filas.forEach((fila) => {
        const cumple =
          (!tipo || normalizar(fila.dataset.tipo) === tipo) &&
          (!continente || normalizar(fila.dataset.continente) === continente) &&
          Number(fila.dataset.precio) <= precioMax;
        fila.classList.toggle('d-none', !cumple);
        if (cumple) visibles++;
      });

      if (contador) contador.textContent = `Mostrando ${visibles} de ${filas.length} destinos`;
      if (sinResultados) sinResultados.classList.toggle('d-none', visibles > 0);
    };

    [filtroTipo, filtroContinente, filtroPrecio].forEach((el) => el.addEventListener('change', filtrar));
    if (botonBuscar) botonBuscar.addEventListener('click', filtrar);
    filtrar();
  }
});
