import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import select from '../../../public/Select.png';

interface ShaderPack {
  project_id: string;
  title: string;
  icon_url: string;
  description?: string;
  download_url?: string;
}


const ModrinthShaderPackManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ShaderPack[]>([]);
  const [selectedPacks, setSelectedPacks] = useState<ShaderPack[]>([]);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [requestCount, setRequestCount] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedModId, setExpandedModId] = useState(null);
  const [expandedPackId, setExpandedPackId] = useState(null);

  const toggleExpandPack = (packId: any) => {
    setExpandedPackId(expandedPackId === packId ? null : packId);
  };

  const toggleExpand = (modId: any) => {
    setExpandedModId(expandedModId === modId ? null : modId);
  };

  const incrementRequestCount = () => {
    setRequestCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 900 && !blocked) {
        setBlocked(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setBlocked(false);
          setRequestCount(0);
        }, 60000);
      }
      return newCount;
    });
  };

  const resetRequestCount = () => {
    setRequestCount(0);
  };
  
  resetRequestCount;

  console.log(requestCount);

  const fetchShaderPacks = useCallback(
    debounce(async (query: string) => {
      if (blocked) {
        alert("You are putting too much load on the server, please wait just one minute");
        return;
      }

      if (query.length > 0) {
        try {
          incrementRequestCount();
          setLoading(true);
          const response = await axios.get(`https://api.modrinth.com/v2/search`, {
            params: {
              query,
              facets: `[["project_type:shader"]]`,
            },
            timeout: 10000,
          });
          setSearchResults(response.data.hits);
        } catch (error) {
          console.error("Ошибка при поиске шейдерпаков:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500),
    [blocked]
  );

  useEffect(() => {
    fetchShaderPacks(searchQuery);
  }, [searchQuery, fetchShaderPacks]);

  const fetchShaderPackDownloadUrl = async (pack: ShaderPack) => {
    try {
      const response = await axios.get(
        `https://api.modrinth.com/v2/project/${pack.project_id}/version`,
        { timeout: 10000 }
      );
      const version = response.data[0];
      return version.files[0].url;
    } catch (error) {
      console.error("Ошибка при получении ссылки для скачивания шейдерпака:", error);
      return null;
    }
  };

  const handleAddPack = async (pack: ShaderPack) => {
    if (!selectedPacks.find((p) => p.project_id === pack.project_id)) {
      const downloadUrl = await fetchShaderPackDownloadUrl(pack);
      setSelectedPacks((prevPacks) => [...prevPacks, { ...pack, download_url: downloadUrl }]);
    }
  };

  const handleRemovePack = (pack: ShaderPack) => {
    setSelectedPacks((prevPacks) => prevPacks.filter((p) => p.project_id !== pack.project_id));
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const shaderPacksFolder = zip.folder("shaderpacks");
    if (!shaderPacksFolder) return;

    await Promise.all(
      selectedPacks.map(async (pack) => {
        if (pack.download_url) {
          const response = await axios.get(pack.download_url, { responseType: "blob" });
          shaderPacksFolder.file(`${pack.title}.zip`, response.data);
        }
      })
    );

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "shaderpacks.zip");
  };

  return (
    <div className="modrinth">
      <div className="modrinthR-container">
        <div className="modrinth-content">
          <div className="modrinthR-left">
            <div className="sr">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for shaderPacks..."
                className="ul-mod"
              />
              {loading ? (
                <div className="loader"></div>
              ) : (
                searchQuery && (
                  <ul className="modrinth-list">
                    {searchResults.map((pack) => (
<li className="li-mod" key={pack.project_id} onClick={() => handleAddPack(pack)} >
          <button
            onClick={() => {
              toggleExpandPack(pack.project_id);
            }}
            className="toggle-button"
          >
            <img
              src={select}
              alt={expandedPackId === pack.project_id ? 'Collapse' : 'Expand'}
              className={expandedPackId === pack.project_id ? 'expanded' : 'collapsed'}
            />
          </button>
          <img src={pack.icon_url} alt={pack.title} className="mod-icon" />
          <span className="added">{pack.title}</span>
          {expandedPackId === pack.project_id && (
            <div className="pack-details">
              <p>Additional details about {pack.title}</p>
            </div>
          )}
        </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
          <div className="modrinth-right">
            <h3>Selected ShaderPacks:</h3>
            <ul className="selected-mods-listR">
              {selectedPacks.map((pack) => (
                <li key={pack.project_id} className="selected-mod-item">
                <button
        onClick={() => toggleExpand(pack.project_id)}
        className="toggle-button"
      >
        <img
          src={select}
          alt={expandedModId === pack.project_id ? 'Collapse' : 'Expand'}
          className={expandedModId === pack.project_id ? 'expanded' : 'collapsed'}
        />
      </button>
      <img
        src={pack.icon_url}
        alt={pack.title}
        className="mod-icon"
      />
      <span
        className="added"
      >
        {pack.title}
      </span>
      
      <button
        onClick={() => handleRemovePack(pack)}
        className="btn-mod"
      >
        Remove
      </button>
      {expandedModId === pack.project_id && (
        <div className="mod-details">
          <h2>{pack.description}</h2>
        </div>
      )}
    </li>
              ))}
            </ul>
            {selectedPacks.length > 0 && (
              <button className="btn-mody" onClick={handleDownload}>Download ShaderPacks</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModrinthShaderPackManager;
