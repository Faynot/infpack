import React, { useState } from 'react';

interface Mod {
  project_id: string;
  title: string;
  icon_url: string;
  versions: { [key: string]: any }[];
  download_url?: string;
  autoAdded?: boolean;
  description?: string;
  pack?: string; // Добавляем информацию о паке
}

interface ExpandableListItemProps {
  mod: Mod;
  handleRemoveMod: (mod: Mod) => void;
}

const ExpandableListItem: React.FC<ExpandableListItemProps> = ({ mod, handleRemoveMod }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <li key={mod.project_id} className="selected-mod-item">
      <div className="header" onClick={toggleExpand}>
        <span className={`toggle ${expanded ? 'expanded' : ''}`}>▶</span>
        <img src={mod.icon_url} alt={mod.title} className="mod-icon" />
        <span
          className="added"
          style={{
            color: mod.autoAdded ? "#9ccc00" : "white",
            fontFamily: "Gill",
          }}
        >
          {mod.title}
        </span>
        <button onClick={() => handleRemoveMod(mod)} className="btn-mod">
          Remove
        </button>
      </div>
      <div className={`content ${expanded ? 'expanded' : ''}`}>
        <p>Текст, который выдвигается.</p>
      </div>
    </li>
  );
};

export default ExpandableListItem;
