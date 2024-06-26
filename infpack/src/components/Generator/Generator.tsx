import Logo from '../../../public/Logo.png';
import Footer from '../Footer/Footer';
import ModrinthModManager from '../ModrinthModManager/ModrinthModManager';
import ModrinthResourcepacksManager from '../ModrinthResourcepacksManager/ModrinthResourcepacksManager';
import ModrinthShaderpacksManager from '../ModrinthShaderpacksManager/ModrinthShaderpacksManager';
import './Generator.css';

const Generator: React.FC = () => {
  return (
    <div>
      <div className='logo-container'>
        <a href='/'><img className='logo' src={Logo} alt="Logo" /></a>
      </div>
      <br /><br /><br /><br /><br /><br />
      <div className='modrinthZ'>
        <div className='modrinth-manager'>
          <ModrinthModManager />
        </div>
        <div className='modrinth-manager'>
          <ModrinthResourcepacksManager />
          <ModrinthShaderpacksManager />
        </div>
        
      </div>
      <div className='fo'>
        <Footer />
      </div>
    </div>
  );
};

export default Generator;
