import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

// --- DATOS ---
const filas = [
    ["%", "CE", "C", "⌫"],
    ["1/x", "x²", "√x", "/"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["+/-", "0", ".", "="]
];

// --- ESTILOS (HELPER) ---
// Esta función decide qué color lleva cada botón
const getClaseBoton = (val) => {
    // Clases base para TODOS los botones (transición suave, texto grande, redondeado)
    const base = "h-14 sm:h-16 text-xl font-semibold rounded-sm transition-all duration-150 active:scale-95 border border-transparent";

    // 1. Botón IGUAL (=): Azul Windows (Accent)
    if (val === "=") return `${base} bg-green-600 hover:bg-green-500 text-black shadow-lg shadow-green-900/50 text-lg font-semibold`;

    // 2. Operadores y Funciones (C, %, x, -): Gris oscuro
    // Nota: isNaN funciona, pero excluimos el punto y el +/-
    if (isNaN(val) && val !== "." && val !== "+/-") {
        return `${base} bg-gray-700/50 hover:bg-green-600 text-green-400`; // Texto cyan para resaltar operadores
    }

    // 3. Números (0-9): Gris "Negro suave"
    return `${base} bg-gray-800 hover:bg-gray-700 text-white`;
};

// --- COMPONENTE FILA ---
const RowButtons = ({ valores, manejarClick }) => (
    <>
        {valores.map((valor) => (
            <button
                key={valor}
                type="button"
                className={getClaseBoton(valor)}
                onClick={() => manejarClick(valor)}
            >
                {valor}
            </button>
        ))}
    </>
)

// --- COMPONENTE PRINCIPAL ---
const Calculadora = () => {
    // TUS ESTADOS (Sin cambios)
    const [pantalla, setPantalla] = useState("0");
    const [historial, setHistorial] = useState("");
    const [valorAnterior, setValorAnterior] = useState(null);
    const [operador, setOperador] = useState(null);
    const [esperarNuevoNumero, setEsperarNuevoNumero] = useState(false);

    // TU LÓGICA DE CALCULAR (Sin cambios - Copia la función 'calcular' aquí)
    const calcular = (num1, num2, op) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        if (isNaN(a) || isNaN(b)) return 0;
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "x": return a * b;
            case "/": return a / b;
            default: return b;
        }
    };

    // TU LÓGICA DE CLICKS (Sin cambios - Copia la función 'manejarClick' aquí)
    const manejarClick = (textoBoton) => {
        if (!isNaN(textoBoton) || textoBoton === ".") {
            if (esperarNuevoNumero) {
                setPantalla(textoBoton);
                setEsperarNuevoNumero(false);
            } else {
                if (textoBoton === "." && pantalla.includes(".")) return;
                setPantalla(pantalla === "0" && textoBoton !== "." ? textoBoton : pantalla + textoBoton);
            }
            return;
        }
        if (["+", "-", "x", "/"].includes(textoBoton)) {
            if (operador !== null && !esperarNuevoNumero && valorAnterior !== null) {
                const resultado = calcular(valorAnterior, pantalla, operador);
                setPantalla(String(resultado));
                setValorAnterior(resultado);
                setHistorial(`${resultado} ${textoBoton}`);
            } else {
                setValorAnterior(parseFloat(pantalla));
                setHistorial(`${pantalla} ${textoBoton}`);
            }
            setOperador(textoBoton);
            setEsperarNuevoNumero(true);
            return;
        }
        if (textoBoton === "=") {
            if (operador === null || valorAnterior === null) return;
            const resultado = calcular(valorAnterior, pantalla, operador);
            setHistorial("");
            setPantalla(String(resultado));
            setValorAnterior(null);
            setOperador(null);
            setEsperarNuevoNumero(true);
            return;
        }
        if (textoBoton === "C") {
            setPantalla("0"); setHistorial(""); setValorAnterior(null); setOperador(null); setEsperarNuevoNumero(false); return;
        }
        if (textoBoton === "CE") { setPantalla("0"); return; }
        if (textoBoton === "⌫") {
            if (esperarNuevoNumero) return;
            setPantalla(pantalla.length === 1 ? "0" : pantalla.slice(0, -1));
            return;
        }
        if (textoBoton === "+/-") setPantalla(String(parseFloat(pantalla) * -1));
        if (textoBoton === "x²") { setPantalla(String(Math.pow(parseFloat(pantalla), 2))); setHistorial(pantalla + "²"); return; }
        if (textoBoton === "√x") { setPantalla(String(Math.sqrt(parseFloat(pantalla)))); setHistorial("√" + pantalla); return; }
        if (textoBoton === "1/x") { setPantalla(String(1 / parseFloat(pantalla))); setHistorial("1/(" + pantalla + ")"); return; }
    };

    // --- EL RETURN VISUAL---
    return (
        // Fondo de toda la página
        <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex items-center justify-center p-4">

            {/* Contenedor de la Calculadora (Caja gris) */}
            <div className="w-full max-w-xs sm:max-w-sm bg-neutral-950 shadow-2xl overflow-hidden border border-neutral-800">

                {/* Pantalla (Display) */}
                <div className="p-6 text-right space-y-2 bg-neutral-900 from-neutral-800 to-neutral-900 border-b border-solid border-white" >
                    {/* Historial pequeño */}
                    <div className="h-6 text-gray-400 text-sm font-mono overflow-hidden">
                        {historial}
                    </div>
                    {/* Número principal grande */}
                    <div className="text-5xl font-bold text-white tracking-tight break-all">
                        {pantalla}
                    </div>
                </div>

                {/* Grid de Botones */}
                <div className="p-4 grid grid-cols-4 gap-2 bg-neutral-900">
                    {filas.map((fila, i) => (
                        <RowButtons key={i} valores={fila} manejarClick={manejarClick} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const root = createRoot(document.getElementById('root'))
root.render(<Calculadora />)