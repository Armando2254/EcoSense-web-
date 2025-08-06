// 1. Obtener el ID del administrador (puedes guardarlo en localStorage después del login)


const adminId = adminI; // Reemplaza esto con el ID real

// 2. Función para cargar los datos del administrador
async function loadAdminData() {
    try {
        const response = await fetch(window.settings.apiUrl+`administrador/${adminId}`);
        if (!response.ok) throw new Error("Error al cargar datos");
        
        const admin = await response.json();
        
        // Mostrar datos en el HTML
        document.getElementById("admin-name").textContent = 
            `${admin.nombrePila} ${admin.primerApell} ${admin.segundoApell}`;
        document.getElementById("admin-email").textContent = admin.email;
        document.getElementById("admin-age").textContent = admin.edad;
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar los datos del administrador.");
    }
}

// 3. Función para actualizar los datos
async function updateAdminData(updatedData) {
    try {
        const response = await fetch(window.settings.apiUrl+`administrador`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });
        
        if (!response.ok) throw new Error("Error al actualizar");
        
        alert("Perfil actualizado correctamente!");
        loadAdminData(); // Recargar datos
    } catch (error) {
        console.error("Error:", error);
        alert("Error al actualizar el perfil.");
    }
}

// 4. Eventos del modal de edición
document.getElementById("btn-edit-profile").addEventListener("click", () => {
    document.getElementById("edit-modal").style.display = "flex";
});

document.getElementById("btn-cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-modal").style.display = "none";
});

document.getElementById("edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const updatedAdmin = {
        Id: adminId,
        nombrePila: document.getElementById("edit-name").value.split(" ")[0],
        primerApell: document.getElementById("edit-name").value.split(" ")[1],
        segundoApell: document.getElementById("edit-name").value.split(" ")[2] || "",
        email: document.getElementById("edit-email").value,
        edad: parseInt(document.getElementById("edit-age").value),
    };
    
    updateAdminData(updatedAdmin);
    document.getElementById("edit-modal").style.display = "none";
});

// 5. Cargar datos al iniciar la página
window.onload = loadAdminData;