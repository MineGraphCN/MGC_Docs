<template>
  <div>
    <table class="custom-table">
      <thead>
      <tr>
        <th>序号</th>
        <th>名称</th>
        <th>作者</th>
        <th>风格</th>
        <th style="width: 3em;">状态</th>
        <th>价格</th>
        <th>平台</th>
        <th v-if="work_type === 'java_shader' || work_type === 'java_resourcepack'">手册</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in chooseForm()" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.author }}</td>
        <td style="width: 2em;">{{ item.style }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.price }}</td>
        <td><a :href="item.platform_link">{{ item.platform }}</a></td>
        <td v-if="work_type === 'java_shader' || work_type === 'java_resourcepack'">
          <a :href="item.guide_link">{{ item.guide }}</a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import javaShadersJsonData from '../works_json/java_shaders.json'
import javaResourcePacksJsonData from '../works_json/java_resourcepacks.json'
import bedrockShadersJsonData from '../works_json/bedrock_shaders.json'
import bedrockResourcePacksJsonData from '../works_json/bedrock_resourcepacks.json'

export default {
  name: "WorkTable",
  props: {
    work_type: {
      type: String,
      required: true
    }
  },
  methods: {
    chooseForm() {
      switch (this.work_type) {
        case "java_shader":
          return this.javaShadersData
        case "java_resourcepack":
          return this.javaResourcePacksData
        case "bedrock_shader":
          return this.bedrockShadersData
        case "bedrock_resourcepack":
          return this.bedrockResourcePacksData
        default:
          return []
      }
    }
  },
  data() {
    return {
      javaShadersData: [],
      javaResourcePacksData: [],
      bedrockShadersData: [],
      bedrockResourcePacksData: []
    };
  },
  mounted() {
    this.javaShadersData = javaShadersJsonData;
    this.javaResourcePacksData = javaResourcePacksJsonData;
    this.bedrockShadersData = bedrockShadersJsonData;
    this.bedrockResourcePacksData = bedrockResourcePacksJsonData;
  }
}
</script>

<style scoped>
.custom-table {
  text-align: center;
}

.custom-table th, .custom-table td {
  padding-top: 1%;
  padding-bottom: 1%;
  height: 10px;
}
</style>
