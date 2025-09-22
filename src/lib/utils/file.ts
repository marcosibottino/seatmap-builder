export const exportJSON = (mapName: string, json: string) => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mapName}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const importJSON = (file: File, callback: (json: any) => void) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const json = JSON.parse(ev.target?.result as string);
            callback(json);
        } catch {
            alert("El archivo no es un JSON válido");
        }
    };
    reader.readAsText(file);
};
