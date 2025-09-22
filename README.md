# SeatMap Builder 🎟️

Aplicación desarrollada en **React + Next.js + TypeScript** que permite crear, editar y gestionar mapas de asientos de manera visual.
Este proyecto surge a partir de una **prueba técnica** y se extendió con mejoras adicionales que lo acercan a un producto más completo y usable.

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/usuario/seatmap-builder.git
   cd seatmap-builder
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir en el navegador:

   ```
   http://localhost:3000
   ```

---

## 📝 Funcionalidades (requeridas en la prueba técnica)

* **Editor visual de asientos**

  * Crear filas y agregar asientos en cada fila.
  * Etiquetado automático de filas y asientos.
  * Límite máximo de **25 asientos por fila**.

* **Gestión de filas**

  * Agregar, renombrar (fila + prefijo de asientos), recolorear y eliminar.
  * Etiquetado rápido con prefijos (ejemplo: `A1..A10`, `VIP1..VIP10`).

* **Gestión de asientos**

  * Selección simple o múltiple.
  * Renombrar asientos seleccionados.
  * Eliminar asientos seleccionados.

* **Importar y exportar JSON**

  * Exportación con nombre del mapa (incluye metadatos).
  * Importación validada desde archivo `.json`.

* **Nuevo mapa**

  * Limpieza completa del estado para comenzar desde cero.

---

## ✨ Mejoras adicionales implementadas

Además de los requisitos originales, se añadieron varias **mejoras de UX y features extra**:

* 🎨 **Colores de filas editables**: cada fila tiene un color personalizable, heredado por sus asientos.
* 🪄 **Sidebar derecho dinámico**:

  * Renombrar asientos seleccionados (prefijo).
  * Recolorear asientos de forma individual.
  * Mover asientos a otra fila.
  * Eliminar asientos seleccionados.
  * Botón **“Listo”** para cerrar edición rápidamente.
* ➕ **Asiento nuevo (modo draft)**:

  * Crear un asiento individual en el centro del mapa.
  * Drag & drop para colocarlo en cualquier lugar.
  * Al confirmar, se abre automáticamente el sidebar para configurarlo.
  * Tooltip inicial de ayuda y animación (parpadeo) para guiar al usuario.
* 🖱️ **Hover tooltip** sobre asientos mostrando `Fila: X` y `Asiento: Yn`.
* 📦 **Exportación con timestamp** y datos consistentes.
* 🔔 **Snackbars de éxito** al renombrar o recolorear.
* ⚡ Validaciones adicionales:

  * Límite físico de distribución en el estadio.
  * Máximo de 25 asientos por fila.

---

## 🛠️ Stack técnico

* **Framework**: [Next.js](https://nextjs.org/) (React + TypeScript).
* **Estado global**: [Zustand](https://github.com/pmndrs/zustand).
* **UI Components**: [Material UI](https://mui.com/).
* **Canvas 2D**: [react-konva](https://konvajs.org/).

---

## 📂 Estructura del proyecto

```
/lib
  state.ts          # Zustand store (estado global, lógica de filas/asientos)
/components
  Sidebar.tsx       # Sidebar izquierdo (gestión de filas, exportar/importar)
/components
  SeatSidebar.tsx   # Sidebar derecho (gestión avanzada de asientos)
/components
  SeatMapCanvas.tsx # Canvas con react-konva (render visual de asientos)
```

---

## ✅ Supuestos y decisiones de diseño

* Los **colores** de fila se heredan automáticamente en todos los asientos de esa fila.
* Los asientos creados individualmente (`draft seat`) se asignan a la primera fila disponible, o quedan en `unassigned`.
* Se priorizó la **usabilidad**: tooltips, snackbars y feedback visual.
* El **estado es solo en memoria**: no hay persistencia en DB.
* La **exportación JSON** incluye: `nombreMapa`, `timestamp`, `rows`, `seats`.

---

## 📦 Export/Import JSON

Ejemplo de archivo exportado:

```json
{
  "nombreMapa": "MapaEjemplo",
  "timestamp": "2025-09-20T18:34:22.123Z",
  "rows": [
    {
      "id": "row-0",
      "label": "A",
      "seatIds": ["row-0-0", "row-0-1"],
      "color": "hsl(120, 70%, 60%)",
      "seatPrefix": "A"
    }
  ],
  "seats": {
    "row-0-0": { "id": "row-0-0", "label": "A1", "rowId": "row-0", "x": 600, "y": 200, "color": "hsl(120, 70%, 60%)" },
    "row-0-1": { "id": "row-0-1", "label": "A2", "rowId": "row-0", "x": 650, "y": 200, "color": "hsl(120, 70%, 60%)" }
  }
}
```

---

## 📌 Conclusión

El proyecto cumple con **todos los objetivos de la prueba técnica** y además integra varias mejoras de **UX y gestión avanzada**, lo que lo convierte en un **SeatMap Builder más completo y flexible**.
