import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import select from '../../../public/Select.png';
import { getFromLocalStorage } from "../../storage";

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

const ai = getFromLocalStorage("SelectedAI") || false;

const version = getFromLocalStorage("selectedVersion") || "1.20.1";
const modLoader = getFromLocalStorage("selectedModLoader") || "fabric";

const modNamesToAddFABRIC = [
  "Architectury API",
  "Concurrent Chunk Management Engine",
  "DCCH",
  "e4mc",
  "Ears",
  "Entity Model Features",
  "Entity Texture Features",
  "Entity Sound Features",
  "EntityCulling",
  "fabric-permissions-api",
  "Fabric Sky Boxes",
  "FerriteCore",
  "Horse Stats Vanilla",
  "Immediately Fast",
  "Indium",
  "Krypton",
  "Lithium",
  "Main Menu Credits",
  "MaLiLib",
  "Memory Leak Fix",
  "Model Gap Fix",
  "No Resource Pack Warnings",
  "No Telemetry",
  "Sodium",
  "Very Many Players",
  "fabric language kotlin",
  "Cloth Config",
  "Cicada",
  "Mod Menu",
  "fabric api",
  "iris",
  "Reese's Sodium Options",
  "Particle Core",
];

const modNamesToAddQUILT = [
  "sodium",
  "iris",
  "Mod Menu",
  "Entity Culling",
  "Lithium",
  "FerriteCore",
  "Architectury API",
  "Sodium Extra",
  "ImmediatelyFast",
  "YetAnotherConfigLib",
  "Reese's Sodium Options",
  "Memory Leak Fix",
  "Continuity",
  "Dynamic FPS",
  "Entity Texture Features",
  "Entity Sound Features",
  "fabric language kotlin",
  "More Culling",
  "Model Gap Fix",
  "FastQuit",
  "Remove Reloading Screen",
  "Smooth Boot (Fabric)",
  "Staaaaaaaaaaaack (Stxck)",
  "qfapi",
  "Cloth Config API",
  "Quilted Fabric API (QFAPI) / Quilt Standard Libraries (QSL)"
];

const modNamesToAddNEOFORGE = [
  "Rubidium",
  "Entity Model Features",
  "Entity Texture Features",
  "Entity Sound Features",
  "Another Create Pack",
  "Archer's Paradox",
  "Better Beds Reforged",
  "Cloth Config API",
  "CoFH Core",
  "Cull Leaves",
  "Dynamic FPS",
  "Entity Culling",
  "Fastload",
  "FerriteCore",
  "ImmediatelyFast",
  "Memory Leak Fix",
  "MidnightLib",
  "Model Gap Fix",
  "ModernFix",
  "Noisium",
  "Radium",
  "Rayon",
  "Saturn",
  "Starlight",
  "Titanuim",
  "WI Zoom",
  "World Pre Generator",
  "Mod Menu",
];

const modNamesToAddFORGE = [
  "Rubidium",
  "Entity Model Features",
  "Entity Texture Features",
  "Entity Sound Features",
  "Another Create Pack",
  "Archer's Paradox",
  "Better Beds Reforged",
  "Cloth Config API",
  "CoFH Core",
  "Cull Leaves",
  "Dynamic FPS",
  "Entity Culling",
  "Fastload",
  "FerriteCore",
  "ImmediatelyFast",
  "Memory Leak Fix",
  "MidnightLib",
  "Model Gap Fix",
  "ModernFix",
  "Noisium",
  "Radium",
  "Rayon",
  "Saturn",
  "Starlight",
  "Titanuim",
  "WI Zoom",
  "World Pre Generator",
  "Mod Menu",
];

let ytpack: string[] = [];
let clientpack: string[] = [];

const getModNamesToAdd = (loader: string) => {
  switch (loader) {
    case "fabric":
      return modNamesToAddFABRIC;
    case "quilt":
      return modNamesToAddQUILT;
    case "forge":
      return modNamesToAddFORGE;
    case "neoforge":
      return modNamesToAddNEOFORGE;
    default:
      return [];
  }
};

switch (modLoader) {
  case "fabric":


  ytpack = [
    "ReplayMod",
    "pv-addon-replaymod",
    "Motion Capture",
    "Skin Shuffle",
  ];


    clientpack = [
      "AppleSkin",
      "Falling Leaves",
      "Chest Tracker",
      "resence Footsteps",
      "Dark Loading Screen",
      "No Chat Reports",
      "Wakes",
      "BetterF3",
      "Language Reload",
      "Capes",
      "Stendhal",
      "Animatica",
      "AdvancementInfo",
      "Dynamic Crosshair",
      "Better Statistics Screen",
      "Cherished Worlds",
      "Distant Horizons",
      "Plasmo Voice",
      "ClickThrough",
      "Longer Chat History",
      "Camera Utils",
      "Simple Voice Chat",
      "Chat Heads",
      "Emoji Type",
      "Figura",
      "Chat Animation",
    ];


    break;
  case "forge":


    ytpack = ["Simple Voice Chat", "Plasmo Voice"];


    clientpack = [
      "AppleSkin",
      "No Chat Reports",
      "BetterF3",
      "Capes",
      "Dynamic Crosshair",
      "Better Statistics Screen",
      "Cherished Worlds",
      "Distant Horizons",
      "Plasmo Voice",
      "Simple Voice Chat",
      "Falling Leaves (NeoForge/Forge)",
      "Chat Heads",
      "Emoji Type",
      "Figura",
      "Longer Chat History",
    ];


    break;
  case "neoforge":


    ytpack = ["Simple Voice Chat", "Plasmo Voice"];


    clientpack = [
      "AppleSkin",
      "No Chat Reports",
      "BetterF3",
      "Capes",
      "Dynamic Crosshair",
      "Cherished Worlds",
      "Falling Leaves (NeoForge/Forge)",
      "Distant Horizons",
      "Plasmo Voice",
      "Longer Chat History",
      "Simple Voice Chat",
      "Emoji Type",
      "Figura",
      "Chat Heads",
    ];
    break;
  case "quilt":


    ytpack = [
      "ReplayMod",
      "pv-addon-replaymod",
      "Motion Capture",
      "Skin Shuffle",
    ];


    clientpack = [
      "AppleSkin",
      "Chest Tracker",
      "Falling Leaves",
      "resence Footsteps",
      "Wakes",
      "No Chat Reports",
      "BetterF3",
      "Language Reload",
      "Stendhal",
      "Capes",
      "Animatica",
      "AdvancementInfo",
      "Dynamic Crosshair",
      "Better Statistics Screen",
      "Cherished Worlds",
      "Distant Horizons",
      "Plasmo Voice",
      "ClickThrough",
      "Longer Chat History",
      "Dark Loading Screen",
      "Camera Utils",
      "Simple Voice Chat",
      "Chat Heads",
      "Emoji Type",
      "Figura",
      "Chat Animation",
    ];


    break;
  default:
    ytpack = ["Simple Voice Chat", "Plasmo Voice"];
    clientpack = [
      "Dynamic Crosshair",
      "AppleSkin",
      "No Chat Reports",
      "BetterF3",
      "Capes",
      "Distant Horizons",
      "Plasmo Voice",
      "Longer Chat History",
      "Simple Voice Chat",
      "Chat Heads",
      "Figura",
      "Emoji Type",
    ];
}

const fetchModVersions = async (mod: Mod) => {
  const fetchModForLoader = async (loader: string) => {
    const response = await axios.get(
      `https://api.modrinth.com/v2/project/${mod.project_id}/version`,
      { timeout: 10000 }
    );
    return response.data.find(
      (v: any) =>
        v.game_versions.includes(version) &&
        v.loaders.includes(loader)
    );
  };

  let versionData = await fetchModForLoader(modLoader);

  if (!versionData && modLoader === "quilt") {
    versionData = await fetchModForLoader("fabric");
  }

  if (versionData) {
    return { ...mod, download_url: versionData.files[0].url };
  }
  return mod;
};

const fetchModByName = async (name: string, loader: string) => {
  try {
    const response = await axios.get(
      `https://api.modrinth.com/v2/search`,
      {
        params: {
          query: name,
          facets: `[["versions:${version}"],["categories:${loader}"]]`,
        },
        timeout: 10000,
      }
    );
    let exactMatch = response.data.hits.find(
      (mod: Mod) => mod.title.toLowerCase() === name.toLowerCase()
    );

    // If no mods found and loader is "quilt", attempt to find the mod on "fabric"
    if (!exactMatch && loader === "quilt") {
      const fabricResponse = await axios.get(
        `https://api.modrinth.com/v2/search`,
        {
          params: {
            query: name,
            facets: `[["versions:${version}"],["categories:fabric"]]`,
          },
          timeout: 10000,
        }
      );
      exactMatch = fabricResponse.data.hits.find(
        (mod: Mod) => mod.title.toLowerCase() === name.toLowerCase()
      );
    }

    return exactMatch || null;
  } catch (error) {
    console.error(`Error fetching ${name} mod:`, error);
    return null;
  }
};


const ModrinthModManager: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [blocked, setBlocked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isYoutuberPackEnabled, setIsYoutuberPackEnabled] = useState(false);
  const [isClientPackEnabled, setIsClientPackEnabled] = useState(false);
  const [isAllPacksEnabled, setIsAllPacksEnabled] = useState(false);
  const [expandedModId, setExpandedModId] = useState(null);

  const toggleExpand = (modId: any) => {
    setExpandedModId(expandedModId === modId ? null : modId);
  };


  useEffect(() => {
    if (isYoutuberPackEnabled) {
      handlePackAddition(ytpack);
    } else {
      ytpack.forEach((modName) => handleRemoveModByName(modName));
    }
  }, [isYoutuberPackEnabled]);
  
  useEffect(() => {
    if (isClientPackEnabled) {
      handlePackAddition(clientpack);
    } else {
      clientpack.forEach((modName) => handleRemoveModByName(modName));
    }
  }, [isClientPackEnabled]);
  



  const handlePackAddition = async (pack: string[]) => {
    const modsToAdd: Mod[] = [];
    await Promise.all(
      pack.map(async (modName) => {
        const mod = await fetchModByName(modName, modLoader);
        if (mod) {
          const modWithVersion = await fetchModVersions({
            ...mod,
            autoAdded: true,
          });
          modsToAdd.push(modWithVersion);
        }
      })
    );
    setSelectedMods((prevMods) => [
      ...prevMods,
      ...modsToAdd.filter(
        (mod) => !prevMods.some((m) => m.project_id === mod.project_id)
      ),
    ]);
  };


  useEffect(() => {
    window.addEventListener("error", (event) => {
      if (event.error && event.error.status === 502) {
        setHasError(true);
      }
    });

    if (hasError) {
      window.location.href = "/";
      alert("Sorry, technical work is currently underway");
    }
  }, [hasError]);

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
  

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Mod[]>([]);
  const [selectedMods, setSelectedMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMods = useCallback(
    debounce(async (query: string) => {
      if (blocked) {
        alert(
          "You are putting too much load on the server, please wait just one minute"
        );
        return;
      }

      if (query.length > 2) {
        try {
          incrementRequestCount();
          setLoading(true);
          const response = await axios.get(
            `https://api.modrinth.com/v2/search`,
            {
              params: {
                query,
                facets: `[["versions:${version}"],["categories:${modLoader}"]]`,
              },
              timeout: 10000,
            }
          );
          setSearchResults(
            response.data.hits.map((mod: Mod) => ({
              ...mod,
              autoAdded: false,
            }))
          );
        } catch (error) {
          console.error("Error fetching mods:", error);
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
    fetchMods(searchQuery);
  }, [searchQuery, fetchMods]);

  useEffect(() => {
    const addModLoaderDependency = async () => {
      const modNamesToAdd = getModNamesToAdd(modLoader);
      const modsToAdd = await Promise.all(
        modNamesToAdd.map(async (modName) => {
          if (!selectedMods.find((mod) => mod.title === modName)) {
            let mod = await fetchModByName(modName, modLoader);
            if (!mod && modLoader === "quilt") {
              mod = await fetchModByName(modName, "fabric");
            }
            if (mod) {
              return await fetchModVersions({ ...mod, autoAdded: true });
            }
          }
          return null;
        })
      );
      setSelectedMods((prevMods) => {
        const newMods = modsToAdd.filter(
          (mod): mod is Mod =>
            mod !== null &&
            !prevMods.some((m) => m.project_id === mod.project_id)
        );
        return [...prevMods, ...newMods];
      });
    };
    addModLoaderDependency();
  }, [modLoader, version]);

  const handleAddMod = async (mod: Mod) => {
    if (blocked) {
      alert(
        "You are putting too much load on the server, please wait just one minute"
      );
      return;
    }

    if (selectedMods.length >= 300) {
      alert("You cannot add more than 300 mods in one build.");
      return;
    }

    if (!selectedMods.find((m) => m.project_id === mod.project_id)) {
      try {
        incrementRequestCount();
        setLoading(true);
        const modWithVersion = await fetchModVersions(mod);
        setSelectedMods((prevMods) => [...prevMods, modWithVersion]);
      } catch (error) {
        console.error("Error adding mod:", error);
      } finally {
        setLoading(false);
        resetRequestCount();
      }
    }
  };

  const handlePackToggles = (packType: string) => {
    switch (packType) {
      case "youtuber":
        setIsYoutuberPackEnabled(!isYoutuberPackEnabled);
        break;
      case "client":
        setIsClientPackEnabled(!isClientPackEnabled);
        break;
      case "all":
        const allPacksEnabled = !isAllPacksEnabled;
        setIsAllPacksEnabled(allPacksEnabled);
        setIsYoutuberPackEnabled(allPacksEnabled);
        setIsClientPackEnabled(allPacksEnabled);
        if (allPacksEnabled) {
          handlePackAddition(ytpack);
          handlePackAddition(clientpack);
        } else {
          ytpack.forEach((modName) => handleRemoveModByName(modName));
          clientpack.forEach((modName) => handleRemoveModByName(modName));
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isAllPacksEnabled) {
      handlePackAddition(ytpack);
      handlePackAddition(clientpack);
    } else {
      ytpack.forEach((modName) => handleRemoveModByName(modName));
      clientpack.forEach((modName) => handleRemoveModByName(modName));
    }
  }, [isAllPacksEnabled]);
  
  
  const handleRemoveModByName = async (modName: string) => {
    const mod = selectedMods.find((m) => m.title === modName);
    if (mod) {
      handleRemoveMod(mod);
    }
  };
  
  useEffect(() => {
    if (isYoutuberPackEnabled && isClientPackEnabled) {
      setIsAllPacksEnabled(true);
    } else {
      setIsAllPacksEnabled(false);
    }
  }, [isYoutuberPackEnabled, isClientPackEnabled]);
  
  

  const handleRemoveMod = (mod: Mod) => {
    setSelectedMods((prevMods) =>
      prevMods.filter((m) => m.project_id !== mod.project_id)
    );
  };

  const handleRemoveAutoAddedMods = () => {
    setSelectedMods((prevMods) => prevMods.filter((m) => !m.autoAdded));
  };

  const handleDownload = async () => {
    if (blocked) {
      alert(
        "You are putting too much load on the server, please wait just one minute"
      );
      return;
    }

    const zip = new JSZip();
    const minecraftFolder = zip.folder("mods");
    if (!minecraftFolder) return;

    await Promise.all(
      selectedMods.map(async (mod) => {
        if (mod.download_url) {
          const response = await axios.get(mod.download_url, {
            responseType: "blob",
          });
          minecraftFolder.file(`${mod.title}.jar`, response.data);
        }
      })
    );

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "infpack.zip");
  };




  return (
    <div className="modrinth">
      <div className="modrinth-container">
        <div className="modrinth-content">
          <div className="modrinth-left">
            <div className="sr" >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for mods..."
              className="ul-mod"
            />
            {loading ? (
              <div className="loader"></div>
            ) : (
              searchQuery && (
                <ul className="modrinth-list">
                  {searchResults.map((mod) => (
                            <li className="li-mod" key={mod.project_id} onClick={() => handleAddMod(mod)} >
                            <button
                              onClick={() => {
                                toggleExpand(mod.project_id);
                              }}
                              className="toggle-button"
                            >
                              <img
                                src={select}
                                alt={expandedModId === mod.project_id ? 'Collapse' : 'Expand'}
                                className={expandedModId === mod.project_id ? 'expanded' : 'collapsed'}
                              />
                            </button>
                            <img src={mod.icon_url} alt={mod.title} className="mod-icon" />
                            <span className="added">{mod.title}</span>
                            {expandedModId === mod.project_id && (
                              <div className="pack-details">
                                <p>Additional details about {mod.title}</p>
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
            <h3>Selected Mods:</h3>
            <ul className="selected-mods-list">
      {selectedMods.map((mod) => (
        <li key={mod.project_id} className="selected-mod-item">
                    <button
            onClick={() => toggleExpand(mod.project_id)}
            className="toggle-button"
          >
            <img
              src={select}
              alt={expandedModId === mod.project_id ? 'Collapse' : 'Expand'}
              className={expandedModId === mod.project_id ? 'expanded' : 'collapsed'}
            />
          </button>
          <img
            src={mod.icon_url}
            alt={mod.title}
            className="mod-icon"
          />
          <span
            className="added"
            style={{
              color: mod.autoAdded ? "#9ccc00" : "white",
              fontFamily: "Gill",
            }}
          >
            {mod.title}
          </span>
          
          <button
            onClick={() => handleRemoveMod(mod)}
            className="btn-mod"
          >
            Remove
          </button>
          {expandedModId === mod.project_id && (
            <div className="mod-details">
              <h2>{mod.description}</h2>
            </div>
          )}
        </li>
      ))}
    </ul>
            {selectedMods.length > 0 && (
              <>
                <button onClick={handleDownload} className="btn-mody">
                  Download Mods
                </button>
                <button
                  onClick={handleRemoveAutoAddedMods}
                  className="btn-mody remove-auto-added"
                >
                  Remove Auto-Added Mods
                </button>
              </>
            )}
            {ai && (
              <>
                <div className="ai">
                  <input
                    type="text"
                    placeholder="Ask AI..."
                    className="ul-ai-mod"
                  />
                  <button id="submitBtn" className="btn-ai-mod">
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          .loader {
            border: 4px solid #f3f3f3;
            border-radius: 50%;
            border-top: 4px solid #3498db00;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin-left: 9rem;
            margin-top: 9rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {ai && (
        <>
          <div className="tooltip" id="tooltip">
            AI can very often work incorrectly
          </div>
        </>
      )}
    <div className="presets-window">
      <h2 data-translate>Change your mod presets</h2>
      <label className="checkbox-label">
      <img src="../../../public/yt.svg" width={40} />
        <input
          type="checkbox"
          name="preset1"
          checked={isYoutuberPackEnabled}
          onChange={() => handlePackToggles("youtuber")}
        />
        <span> ㅤ ㅤ Pack for Youtubers</span>
      </label>
      <label className="checkbox-label">
      <img src="../../../public/cl.svg" width={40} />
        <input
          type="checkbox"
          name="preset2"
          checked={isClientPackEnabled}
          onChange={() => handlePackToggles("client")}
        />
        <span> ㅤ ㅤ Client mods</span>
      </label>
      <label className="checkbox-label">
      <img src="../../../public/all.svg" width={40} />
        <input
          type="checkbox"
          name="preset3"
          checked={isAllPacksEnabled}
          onChange={() => handlePackToggles("all")}
        />
        <span> ㅤ ㅤ Enable all packs</span>
      </label>
    </div>
    </div>
  );
};

export default ModrinthModManager;