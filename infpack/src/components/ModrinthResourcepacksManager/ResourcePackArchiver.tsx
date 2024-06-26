// downloadUtils.js

import axios from 'axios';

export const handleDownload = async (resourcePacksFolder: any, selectedPacks: any) => {
  if (!resourcePacksFolder) return;

  await Promise.all(
    selectedPacks.map(async (pack: any) => {
      if (pack.download_url) {
        try {
          const response = await axios.get(pack.download_url, { responseType: "blob" });
          resourcePacksFolder.file(`${pack.title}.zip`, response.data);
        } catch (error) {
          console.error(`Ошибка при загрузке ресурспака ${pack.title}:`, error);
        }
      }
    })
  );
};
