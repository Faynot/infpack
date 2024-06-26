import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../public/Logo.png";
import Footer from "./components/Footer/Footer";
import Modloader from "./components/Modloader/Modloader";
import Version from "./components/Version/Version";
import { getFromLocalStorage, saveToLocalStorage } from "./storage";

const Home = () => {
  const [SelectedAI, setSelectedAI] = useState(false);
  //  const [checked, setChecked] = useState({
  //    option1: false,
  //    option2: false,
  //  });

  useEffect(() => {
    const storedAI = getFromLocalStorage("SelectedAI");
    if (storedAI !== null) {
      setSelectedAI(storedAI);
    }
  }, []);

  const handleAIChange = (event: any) => {
    const isChecked = event.target.checked;
    setSelectedAI(isChecked);
    saveToLocalStorage("SelectedAI", isChecked);
  };

  //  const handleCheckboxChange = (event) => {
  //    const { name, checked } = event.target;
  //    setChecked((prev) => ({ ...prev, [name]: checked }));
  //  };

  return (
    <div className="app">
      <div className="logo-container">
        <a href="/">
          <img className="logo" src={Logo} alt="Logo" />
        </a>
      </div>
      <div className="content">
        <h1 className="h1">Welcome to INF PACK!</h1>
        <div className="window">
          <h2>Why should you choose us?</h2>
          <div className="window-window">
            <h2>
              You can create the latest build for Minecraft - this site is
              updated automatically when dependencies are updated. We have a
              very user-friendly interface and we have a default build that
              includes optimization. Create YOUR current modpack for minecraft right now!
            </h2>
          </div>
          <h2 data-translate >Please, select version and modloader</h2>
          <div className="selected">
            <Version />
            <Modloader />
          </div>
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="option3"
                checked={SelectedAI}
                onChange={handleAIChange}
              />
              <span> ㅤ ㅤ AI mode (in development)</span>
            </label>
          </div>
        </div>
        <Link to="/Generator">
          <button className="btn-gen">Create new modpack</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
