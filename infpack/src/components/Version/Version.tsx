import axios from "axios";
import { useEffect, useState } from "react";
import { saveToLocalStorage } from "../../storage";
import "./Version.css";

const Version = () => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [warning, setWarning] = useState(""); // Добавлено состояние для предупреждения

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await axios.get(
          "https://launchermeta.mojang.com/mc/game/version_manifest.json"
        );
        const versionNames = response.data.versions
          .filter((version: any) => version.type === "release")
          .map((version: any) => version.id)
          .sort((a: any, b: any) => {
            const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
            const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
            if (aMajor !== bMajor) return bMajor - aMajor;
            if (aMinor !== bMinor) return bMinor - aMinor;
            return bPatch - aPatch;
          });
        setVersions(versionNames);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    };

    fetchVersions();
  }, []);

  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedVersion(selectedValue);
    saveToLocalStorage("selectedVersion", selectedValue); // Сохраняем выбранную версию в localStorage

    // Проверяем выбранную версию и обновляем предупреждение
    const [major, minor, patch] = selectedValue.split('.').map(Number);
    if (major < 1 || (major === 1 && minor < 16) || (major === 1 && minor === 16 && patch < 5)) {
      setWarning("Warning: Versions below 1.16.5 may have problems!");
    } else {
      setWarning("");
    }
  };

  return (
    <div className="version-container">
      <div className="sl-wr">
        <select
          className="version-select"
          value={selectedVersion}
          onChange={handleChange}
        >
          {versions.map((version, index) => (
            <option key={index} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>
      {warning && <div className="warning-message">{warning}</div>}
    </div>
  );
};

export default Version;
