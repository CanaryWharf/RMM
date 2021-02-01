import yaml from 'js-yaml';
import * as fs from 'fs';
import path from 'path';
import { https } from 'follow-redirects';

class ModManager {
  constructor(managedFolder, yamlConfig, readycallback) {
    this.folder = managedFolder;
    this.modFile = undefined;
    ModManager.getYamlConfig(yamlConfig).then((config) => {
      this.modFile = config;
      readycallback();
    });
  }

  listDirectory() {
    const filesInDirectory = fs.readdirSync(this.folder);
    return filesInDirectory;
  }

  static getYamlConfig(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        console.log(res);
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = yaml.load(rawData);
            console.log(parsedData);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        });
      })
    })
  }

  checkForChanges() {
    const filesInDirectory = this.listDirectory();
    const modsList = this.modFile.mods;
    const fileNamesInMod = modsList.map(x => x.filename);
    const extraFiles = filesInDirectory.filter(x => fileNamesInMod.indexOf(x) === -1);
    const modsToDownload = modsList.filter(x => filesInDirectory.indexOf(x.filename) === -1);
    return {
      extraFiles,
      modsToDownload,
    }
  }
  syncUp() {
    return new Promise((resolve) => {
      const { extraFiles, modsToDownload } = this.checkForChanges();
      console.log('Extra files', extraFiles);
      console.log('Extra mods', modsToDownload);
      const promises = [];
      extraFiles.forEach((x) => {
        this.deleteFile(x);
      });
      modsToDownload.forEach((x) => {
        promises.push(this.downloadFile(x.url, x.filename));
      });
      Promise.all(promises).then(resolve);
    });

  }


  downloadFile(url, filename) {
    return new Promise((resolve) => {
      const file = fs.createWriteStream(path.join(this.folder, filename));
      console.log('downloading file');
      https.get(url, (res) => {
        console.log(res);
        res.pipe(file);
        resolve();
      })
    });
  }

  deleteFile(filename) {
    fs.unlink(path.join(this.folder, filename), (err) => {
      if (err) {
        throw err;
      }
      console.log(`${filename} deleted`);
    });
  }

}
export default ModManager;
