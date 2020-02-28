<template>
  <div class="wrapper">
    <div class="left_container">
      <div class="input_form">
        <ul>
          <li class="input_item">
            <label class="input_label">경로</label>
            <label class="input_label">main 폴더를 경로로 잡아주셔야 합니다.</label>
            <button @click="fnSelectDirectory" class="btn_folder">
              경로 선택
            </button>
            <input type="text" v-model="generatorInfo.targetPath" />
          </li>
          <li class="input_item">
            <label class="input_label">패키지 명 ex) com.dm.test</label>
            <input type="text" v-model="generatorInfo.packageName" />
          </li>
          <li class="input_item">
            <label class="input_label">모듈 명</label>
            <input type="text" v-model="generatorInfo.moduleName" />
          </li>
          <li class="input_item">
            <label class="input_label">Controller 패키지 명</label>
            <input type="text" v-model="generatorInfo.controllerPackageName" />
          </li>
          <li class="input_item">
            <label class="input_label">Service 패키지 명</label>
            <input type="text" v-model="generatorInfo.servicePackageName" />
          </li>
          <li class="input_item">
            <label class="input_label">Model(DTO) 패키지 명</label>
            <input type="text" v-model="generatorInfo.modelPackageName" />
          </li>
          <li class="input_item">
            <label class="input_label">DAO 패키지 명</label>
            <input type="text" v-model="generatorInfo.daoPackageName" />
          </li>
          <li class="input_item">
            <label class="input_label">ServiceImpl 패키지 별도</label>
            <input type="checkbox" v-model="eachPackage" />
          </li>
        </ul>

        <button @click="fnGenerate">
          생성
        </button>
      </div>
    </div>
    <div class="center_container">

    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'

  export default {
    name: 'generator',
    computed: {
      validated () {
        let validated = true;
        Object.keys(this.generatorInfo).some(key => {
          if(this.fnIsNull(this.generatorInfo[key])) {
            validated = false;
            return validated;
          }
        });

        return  validated;
      }
    },
    data () {
      return {
        generatorInfo: {
          targetPath: '',
          packageName: '',
          moduleName: '',
          controllerPackageName: '',
          servicePackageName: '',
          modelPackageName: '',
          daoPackageName: ''
        },
        templates: {},
        eachPackage: false
      }
    },
    methods: {
      fnGeneratorSource() {
        const fs = require('fs')
        if(!fs.existsSync(this.generatorInfo.targetPath)) {
          this.alert('대상 경로가 존재하지 않습니다.');
          return;
        }

        this.$store.dispatch('setNowLoading', true);

        let basePath = `${this.generatorInfo.targetPath}/java/${this.generatorInfo.packageName.split('.').join('/')}/${this.generatorInfo.moduleName.toLowerCase()}`;
        if(!fs.existsSync(basePath)) {
          fs.mkdirSync(basePath);
        }

        let controllerPath = `${basePath}/controller`;
        let servicePath = `${basePath}/service`;
        let modelPath = `${basePath}/model`;
        let daoPath = `${basePath}/dao`;
        let mapperPath = `${this.generatorInfo.targetPath}/resources/mybatis/sql/${this.generatorInfo.moduleName.toLowerCase()}`;

        let upperModuleName = `${this.generatorInfo.moduleName[0].toUpperCase()}${this.generatorInfo.moduleName.substring(1)}`
        let lowerModuleName = `${this.generatorInfo.moduleName.toLowerCase()}`;

        let templatesCopy = JSON.parse(JSON.stringify(this.templates));

        for(let key in templatesCopy) {
          templatesCopy[key] = templatesCopy[key].replaceAll('{{UpperModuleName}}', upperModuleName);
          templatesCopy[key] = templatesCopy[key].replaceAll('{{LowerModuleName}}', lowerModuleName);
          templatesCopy[key] = templatesCopy[key].replaceAll('{{PackageName}}', this.generatorInfo.packageName);
          templatesCopy[key] = templatesCopy[key].replaceAll('{{DaoPackageName}}', this.generatorInfo.daoPackageName);

          console.log(templatesCopy[key]);
          /*
          templatesCopy[key].split('{{UpperModuleName}}').join(upperModuleName);
          templatesCopy[key].split('{{LowerModuleName}}').join(lowerModuleName);
          templatesCopy[key].split('{{PackageName}}').join(this.generatorInfo.packageName);
          templatesCopy[key].split('{{DaoPackageName}}').join(this.generatorInfo.daoPackageName);
          */
        }

        if(!fs.existsSync(controllerPath)) {
          fs.mkdirSync(controllerPath);
        }
        fs.writeFileSync(`${controllerPath}/${upperModuleName}Controller.java`, templatesCopy['Controller'], 'utf-8')

        if(!fs.existsSync(servicePath)) {
          fs.mkdirSync(servicePath);
        }
        fs.writeFileSync(`${servicePath}/${upperModuleName}Service.java`, templatesCopy['Service'], 'utf-8')
        let serviceImplPath = `${servicePath}`;
        if(this.eachPackage) {
          serviceImplPath = `${servicePath}/impl`;
          fs.mkdirSync(serviceImplPath);
        }
        fs.writeFileSync(`${serviceImplPath}/${upperModuleName}ServiceImpl.java`, templatesCopy['ServiceImpl'], 'utf-8')

        if(!fs.existsSync(modelPath)) {
          fs.mkdirSync(modelPath);
        }
        fs.writeFileSync(`${modelPath}/${upperModuleName}.java`, templatesCopy['Model'], 'utf-8')

        if(!fs.existsSync(daoPath)) {
          fs.mkdirSync(daoPath);
        }
        fs.writeFileSync(`${daoPath}/${upperModuleName}Dao.java`, templatesCopy['Dao'], 'utf-8')

        if(!fs.existsSync(mapperPath)) {
          fs.mkdirSync(mapperPath);
        }
        fs.writeFileSync(`${mapperPath}/${upperModuleName}.xml`, templatesCopy['Mapper'], 'utf-8')

        this.$store.dispatch('setNowLoading', false);
      },
      fnIsNull(target) {
        return !target || target.length < 1;
      },
      fnIsNotNull(target) {
        return target && target.length > 0;
      },
      fnGenerate() {
        if (!this.validated) {
          return;
        }

        ipcRenderer.send('set_generatorInfo', this.generatorInfo);

        this.templates = ipcRenderer.sendSync('get_Templates');
        console.log(this.templates);
        this.fnGeneratorSource();
      },
      fnSelectDirectory() {
        const { dialog } = require('electron').remote;
        let options = {
          title: 'main 폴더를 선택해주세요.',
          defaultPath: this.generatorInfo.targetPath,
          buttonLabel: 'Select',
          properties: ['openDirectory']
        };
        dialog.showOpenDialog(options, (path) => {
          if (path && path.length > 0) {
            this.generatorInfo.targetPath = path[0].split('\\').join('/');
            ipcRenderer.send('set_generatorInfo', this.generatorInfo);
            this.fnSetPackageName();
          }
        });
      },
      fnSetPackageName() {
        const fs = require('fs');
        if (!this.generatorInfo.targetPath || this.generatorInfo.targetPath.length < 1) {
          return;
        }
        if (!fs.existsSync(this.generatorInfo.targetPath)) {
          return;
        }

        let packageNames = [];
        fs.readdir(this.generatorInfo.targetPath, (error, dirs) => {
          if(dirs.indexOf('java') > -1) {
            fs.readdir(`${this.generatorInfo.targetPath}\\java`, (error, dirs) => {
              if(dirs && dirs.length > 0) {
                packageNames.push(dirs[0]);
                fs.readdir(`${this.generatorInfo.targetPath}\\java\\${packageNames[0]}`, (error, dirs) => {
                  if(dirs && dirs.length > 0) {
                    packageNames.push(dirs[0]);
                    fs.readdir(`${this.generatorInfo.targetPath}\\java\\${packageNames[0]}\\${packageNames[1]}`, (error, dirs) => {
                      if(dirs && dirs.length > 0) {
                        packageNames.push(dirs[0]);
                        this.generatorInfo.packageName = packageNames.join('.');
                      }
                    });
                  }
                });
              }
            })
          }
        });
      },
      fnInitValues() {
        this.generatorInfo = ipcRenderer.sendSync('get_generatorInfo');
      }
    },
    mounted () {
      String.prototype.replaceAll = function(search, replacement) {
        let target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
      };

      this.fnInitValues();
      this.fnSetPackageName();

      this.templates = ipcRenderer.sendSync('get_Templates');
      console.log(this.templates);
    }
  }
</script>

<style>
div.left_container {float: left; width: 50%; height: 100%; border-right: 1px solid #ccc;}
div.left_container div.input_form {height: 100%; overflow: auto;}
li.input_item {width: 100%; margin-top: 20px; position: relative; padding: 5px 10px 5px 0;}
li.input_item .btn_folder {position: absolute; top: -15px; right: 10px;}
li.input_item label.input_label {width: 100%; display: block; font-weight: 600;}
li.input_item input[type=text] {width: 100%; border: 1px solid #ccc; padding: 5px; }
li.input_item input[type="checkbox"] { display: inline-block; width: 20px; height: 20px; border: 2px solid #bcbcbc; cursor: pointer; margin-top: 5px; }
li.input_item input[type="checkbox"]:checked { background-color: #0c6990; }
</style>
