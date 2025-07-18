document.addEventListener('DOMContentLoaded', () => {
    // Configuración de elementos del DOM
    const API_URL = '/api/autores'; // Cambiado a URL relativa
    const modal = document.getElementById('autorModal');
    const autorForm = document.getElementById('autorForm');
    const modalTitle = document.getElementById('modalTitle');
    const autoresTable = document.getElementById('autoresTable');
    const autoresTableBody = document.querySelector('#autoresTable tbody');
    const openAddModalBtn = document.getElementById('openAddAutorModal');
    const closeModalBtn = document.getElementById('closeModalButton');
    const messageDiv = document.getElementById('message');
    const buscarInput = document.getElementById('buscar');
    const btnConsultar = document.querySelector('.btn-consultar');
    const listaSection = document.querySelector('.lista');

    // Ocultar elementos inicialmente
    autoresTable.style.display = 'none';
    listaSection.style.display = 'none';

    // Mostrar mensajes temporales
    const showMessage = (text, type = 'success') => {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        setTimeout(() => {
            messageDiv.className = 'message';
            messageDiv.textContent = '';
        }, 3000);
    };

    // Renderizar la tabla de autores
    const renderAutores = (autores = []) => {
        autoresTableBody.innerHTML = '';

        if (autores.length === 0) {
            autoresTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data-message">No se encontraron autores.</td>
                </tr>
            `;
        } else {
            autores.forEach(autor => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${autor.id}</td>
                    <td>${autor.nombre}</td>
                    <td>${autor.email}</td>
                    <td>${autor.estado}</td>
                    <td class="acciones">
                        <button class="edit-btn" data-id="${autor.id}">Editar</button>
                        <button class="delete-btn" data-id="${autor.id}">Eliminar</button>
                    </td>
                `;
                autoresTableBody.appendChild(tr);
            });
        }

        listaSection.style.display = 'block';
        autoresTable.style.display = 'table';
    };

    // Abrir modal para agregar/editar autor
    const openModal = (title = 'Agregar Autor', autor = null) => {
        modalTitle.textContent = title;
        autorForm.reset();
        
        if (autor) {
            document.getElementById('autorId').value = autor.id;
            document.getElementById('nombre').value = autor.nombre;
            document.getElementById('email').value = autor.email;
            document.getElementById('estado').value = autor.estado;
        } else {
            document.getElementById('autorId').value = '';
            document.getElementById('estado').value = 'activo';
        }
        
        modal.style.display = 'block';
    };

    // Cerrar modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Validar datos del autor
    const validarAutor = (autorData) => {
        if (!autorData.nombre || autorData.nombre.trim().length < 3) {
            showMessage('El nombre debe tener al menos 3 caracteres', 'error');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(autorData.email)) {
            showMessage('Ingrese un email válido', 'error');
            return false;
        }

        return true;
    };

    // Obtener todos los autores desde la API
    const fetchAutores = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener autores');
            return await response.json();
        } catch (error) {
            showMessage(error.message, 'error');
            return [];
        }
    };

    // Guardar autor (POST para crear, PUT para actualizar) usando JSON
    const saveAutor = async (autorData) => {
        try {
            let url = API_URL;
            let method = 'POST';
            let dataToSend = { ...autorData };

            if (autorData.id) {
                url = `${API_URL}/${autorData.id}`;
                method = 'PUT';
            } else {
                // Elimina id si es null o undefined
                delete dataToSend.id;
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el autor');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    // Eliminar autor
    const deleteAutor = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE' 
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar el autor');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    // Buscar autor por ID
    const buscarAutorPorId = async (id) => {
        listaSection.style.display = 'block';
        autoresTable.style.display = 'table';

        if (!id || id.trim() === '') {
            const autores = await fetchAutores();
            renderAutores(autores);
            showMessage('Mostrando todos los autores', 'info');
            return;
        }

        const idBuscado = parseInt(id);
        if (isNaN(idBuscado)) {
            showMessage('El ID debe ser un número', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${idBuscado}`);
            if (!response.ok) {
                throw new Error('Autor no encontrado');
            }
            const autor = await response.json();
            renderAutores([autor]);
        } catch (error) {
            renderAutores([]);
            showMessage(error.message, 'error');
        }
    };

    // Manejar envío del formulario
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        const autorData = {
            id: document.getElementById('autorId').value ? parseInt(document.getElementById('autorId').value) : null,
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            estado: document.getElementById('estado').value
        };

        if (!validarAutor(autorData)) return;

        try {
            await saveAutor(autorData);
            showMessage(autorData.id ? 'Autor actualizado con éxito' : 'Autor agregado con éxito');
            closeModal();
            renderAutores(await fetchAutores());
        } catch (error) {
            showMessage(error.message, 'error');
        }
    };

    // Manejar clics en la tabla (editar/eliminar)
    const handleTableClick = async (event) => {
        const target = event.target;
        if (!target.dataset.id) return;

        const autorId = parseInt(target.dataset.id);
        
        if (target.classList.contains('edit-btn')) {
            try {
                const response = await fetch(`${API_URL}/${autorId}`);
                if (!response.ok) throw new Error('Error al cargar el autor');
                const autor = await response.json();
                openModal('Editar Autor', autor);
            } catch (error) {
                showMessage(error.message, 'error');
            }
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm(`¿Está seguro de eliminar al autor?`)) {
                try {
                    await deleteAutor(autorId);
                    showMessage('Autor eliminado correctamente');
                    renderAutores(await fetchAutores());
                } catch (error) {
                    showMessage(error.message, 'error');
                }
            }
        }
    };

    // Inicializar la aplicación
    const init = async () => {
        try {
            const autores = await fetchAutores();
            renderAutores(autores);
        } catch (error) {
            showMessage('Error al cargar los autores: ' + error.message, 'error');
        }
    };

    // Event listeners
    openAddModalBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    autorForm.addEventListener('submit', handleFormSubmit);
    autoresTableBody.addEventListener('click', handleTableClick);

    btnConsultar.addEventListener('click', () => {
        buscarAutorPorId(buscarInput.value);
    });

    buscarInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarAutorPorId(buscarInput.value);
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Iniciar la aplicación
    init();
});