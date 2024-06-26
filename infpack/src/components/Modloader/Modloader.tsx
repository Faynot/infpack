import { ChangeEvent, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "../../storage";
import "./Modloader.css";

const Modloader = () => {
  const [selectedModLoader, setSelectedModLoader] =
    useState("Select mod loader");
  const [warning, setWarning] = useState(""); // Добавлено состояние для предупреждения

  useEffect(() => {
    const storedModLoader = getFromLocalStorage("selectedModLoader");
    if (storedModLoader) {
      setSelectedModLoader(storedModLoader);
    }
  }, []);

  const handleModLoaderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedModLoader(selectedValue);
    saveToLocalStorage("selectedModLoader", selectedValue); // Сохраняем выбранный мод-лоадер в localStorage

    // Проверяем выбранный мод-лоадер и обновляем предупреждение
    if (selectedValue === "neoforge") {
      setWarning("Warning: NeoForge may have compatibility issues!");
    } else {
      setWarning("");
    }
  };

  return (
    <div className="mod-container">
      <div className="sl-wr">
        <select
          className="version-select"
          value={selectedModLoader}
          onChange={handleModLoaderChange}
        >
          <option value="faric">Select a mod loader</option>
          <option value="fabric">Fabric</option>
          <option value="forge">Forge</option>
          <option value="quilt">Quilt</option>
          <option value="neoforge">NeoForge</option>
        </select>
      </div>
      {warning && <div className="warning-message">{warning}</div>}
    </div>
  );
};

export default Modloader;
