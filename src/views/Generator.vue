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
            <input type="text" v-model="targetPath" />
          </li>
          <li class="input_item">
            <label class="input_label">패키지 명 ex) com.dm.test</label>
            <input type="text" />
          </li>
          <li class="input_item">
            <label class="input_label">모듈 명</label>
            <input type="text" />
          </li>
          <li class="input_item">
            <label class="input_label">Controller 패키지 명</label>
            <input type="text" />
          </li>
          <li class="input_item">
            <label class="input_label">Service 패키지 명</label>
            <input type="text" />
          </li>
          <li class="input_item">
            <label class="input_label">Model(DTO) 패키지 명</label>
            <input type="text" />
          </li>
          <li class="input_item">
            <label class="input_label">DAO 패키지 명</label>
            <input type="text" />
          </li>
          <li class="input_item">
            <label class="input_label">ServiceImpl 패키지 별도</label>
            <input type="checkbox" />
          </li>
        </ul>
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
    data () {
      return {
        targetPath: ''
      }
    },
    methods: {
      fnSelectDirectory () {
        const { dialog } = require('electron').remote;
        let options = {
          title: 'main 폴더를 선택해주세요.',
          defaultPath: this.targetPath,
          buttonLabel: 'Select',
          properties: ['openDirectory']
        };
        dialog.showOpenDialog(options, (path) => {
          if(path && path.length > 0) {
            this.targetPath = path[0];
            ipcRenderer.send('set_targetPath', this.targetPath);
          }
        });
      }
    },
    mounted () {
      this.targetPath = ipcRenderer.sendSync('get_targetPath');
    }
  }
</script>

<style>
div.left_container {float: left; width: 50%; height: 100%; border-right: 1px solid #ccc;}
li.input_item {width: 100%; margin-top: 20px; position: relative; padding: 5px 10px 5px 0;}
li.input_item .btn_folder {position: absolute; top: -15px; right: 10px;}
li.input_item label.input_label {width: 100%; display: block; font-weight: 600;}
li.input_item input[type=text] {width: 100%; border: 1px solid #ccc; padding: 5px; }
li.input_item input[type="checkbox"] { display: inline-block; width: 20px; height: 20px; border: 2px solid #bcbcbc; cursor: pointer; margin-top: 5px; }
li.input_item input[type="checkbox"]:checked { background-color: #0c6990; }
</style>
