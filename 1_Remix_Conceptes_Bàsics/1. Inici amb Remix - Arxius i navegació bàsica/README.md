
### **1. Objectiu del codi**
Estem implementant una estructura de rutes a Remix amb un **layout compartit** per la secció `/admin`. Aquest layout inclou un **Navbar** que es manté visible en totes les subrutes (com `/admin/gestio`) i utilitza `<NavLink>` per gestionar estils dinàmics segons l'estat de la navegació.

---

### **2. Estructura actual del projecte**

```
app/
├── routes/
│   ├── admin.jsx            -> Layout pare per a totes les rutes sota /admin
│   ├── admin/
│   │   ├── _index.jsx       -> Contingut inicial de /admin
│   │   ├── gestio.jsx       -> Ruta específica /admin/gestio
```

---

### **3. Explicació dels components**

#### **3.1. `admin.jsx`: Layout compartit**
- **Què fa?** Defineix el layout de la secció `/admin`, que inclou un **Navbar** visible per a totes les subrutes.
- **Clau:** Utilitza `<Outlet />` per renderitzar contingut de les subrutes (`_index.jsx`, `gestio.jsx`, etc.).
- **Exemple de codi:**
  ```jsx
  import { NavLink, Outlet } from "@remix-run/react";

  export default function AdminLayout() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <header>
          <nav className="flex space-x-4">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? "text-blue-500 font-bold" : "text-gray-500"
              }
            >
              Inici Admin
            </NavLink>
            <NavLink
              to="/admin/gestio"
              className={({ isActive }) =>
                isActive ? "text-blue-500 font-bold" : "text-gray-500"
              }
            >
              Gestió
            </NavLink>
          </nav>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <Outlet />
        </main>
      </div>
    );
  }
  ```

#### **3.2. `_index.jsx`: Ruta d'índex**
- **Què fa?** Mostra un contingut predeterminat quan es visita `/admin` (sense subrutes específiques).
- **Clau:** Actua com una ruta d’índex (definida amb `_index.jsx`) i no apareix a la URL.
- **Exemple de codi:**
  ```jsx
  export default function AdminIndex() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Benvingut a l'Administració</h1>
        <p>Selecciona una opció del menú per començar.</p>
      </div>
    );
  }
  ```

#### **3.3. `gestio.jsx`: Ruta específica**
- **Què fa?** Proporciona el contingut de la subruta `/admin/gestio`, accessible des del Navbar.
- **Clau:** Utilitza el layout compartit definit a `admin.jsx`.
- **Exemple de codi:**
  ```jsx
  export default function Gestio() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Gestió d'Usuaris</h1>
        <p>Aquesta és la pàgina de gestió dins del panell d'administració.</p>
      </div>
    );
  }
  ```

---

### **4. Navegació amb `<NavLink>`**
- Hem utilitzat `<NavLink>` per gestionar la navegació dins del layout. Això permet:
  1. Aplicar **classes dinàmiques** segons si l'enllaç és actiu o pendent.
  2. Estilitzar fàcilment els enllaços utilitzant **Tailwind CSS**.
- **Exemple de classe dinàmica:**
  ```jsx
  <NavLink
    to="/admin"
    end
    className={({ isActive }) =>
      isActive ? "text-blue-500 font-bold" : "text-gray-500"
    }
  >
    Inici Admin
  </NavLink>
  ```

---

### **5. Jerarquia de rutes basada en fitxers**
Hem treballat amb el **sistema de rutes basat en fitxers**:
1. **`admin.jsx`:** Actua com a layout pare per a totes les subrutes dins de la carpeta `admin/`.
2. **`_index.jsx`:** Ruta d'índex per a `/admin`.
3. **`gestio.jsx`:** Ruta específica per a `/admin/gestio`.

Aquest enfocament assegura que el Navbar (i qualsevol altra part del layout) es manté constant mentre el contingut de l’`<Outlet />` canvia segons la ruta.

---

### **6. Què hem après fins ara?**
1. **Layouts amb `<Outlet />`:** Ens permeten compartir elements comuns com el Navbar entre diferents rutes.
2. **Rutes d'índex amb `_index.jsx`:** Defineixen contingut inicial per a rutes pare com `/admin`.
3. **`<NavLink>` per enllaços dinàmics:** Estilització automàtica segons l’estat del link (`isActive`, `isPending`).
4. **Tailwind CSS integrat:** Utilitzem classes per mantenir estils consistents i senzills directament al codi JSX.
5. **Estructura jeràrquica de rutes:** La ubicació dels fitxers dins de `routes/` defineix la navegació i jerarquia de l'aplicació.

---
