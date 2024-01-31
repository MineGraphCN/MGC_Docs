<template xmlns="http://www.w3.org/1999/html">
  <div style="text-align: center">
    <button @click="openForm" class="code-button">投稿</button>
  </div>

  <form v-if="showForm" class="overlay" @click.self="closeForm">
    <div class="form-container">
      <label>名称：</label>
      <input type="text" ref="name" />
      <br />
      <label>作者：</label>
      <input type="text" ref="author" />
      <br />
      <label>风格：</label>
      <input type="text" ref="style" />
      <br />
      <label>状态：</label>
      <input type="text" ref="status" />
      <br />
      <label>价格：</label>
      <input type="text" ref="price" />
      <br />
      <label>平台：</label>
      <input type="text" ref="platform" />
      <br />
      <label>平台链接：</label>
      <input type="text" ref="platform_link" />
      <br />

      <span
        v-if="
          this.work_type === 'java_shader' || work_type === 'java_resourcepack'
        "
      >
        <label>手册：</label>
        <input type="text" ref="guide" />
        <br />
      </span>
      <span
        v-if="
          this.work_type === 'java_shader' || work_type === 'java_resourcepack'
        "
      >
        <label>手册链接：</label>
        <input type="text" ref="guide_link" />
        <br />
      </span>

      <button @click="submitForm" type="submit" class="code-button">
        提交
      </button>
    </div>
  </form>
</template>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 300px;
  background-color: white;
  padding: 3em;
  text-align: center;
}

.form-container label {
  display: inline-block;
  width: 80px;
}

.form-container input {
  width: 200px;
  padding: 0.5em;
  margin-bottom: 1em;
  display: inline-block;
  border-radius: 0.25rem;
  border: 0 solid #efefef;
  background-color: #f3f4f5;
}

.code-button {
  background-color: rgb(254, 168, 21);
  transition: background-color 0.3s ease-in-out;
  color: white;
  border: none;
  padding: 1em 2em;
  border-radius: 4px;
  cursor: pointer;
  width: 300px;
  scroll-behavior: smooth;
}

.code-button:hover {
  background-color: #fbc420;
}
</style>

<script>
export default {
  props: {
    work_type: {
      type: String,
      required: true,
    },
    label_name: {
      type: String,
      required: true,
    },
  },
  data() {
    return { showForm: false };
  },
  methods: {
    openForm() {
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    submitForm() {
      // 提交后重置表单数据
      const name = this.$refs.name.value;
      const author = this.$refs.author.value;
      const style = this.$refs.style.value;
      const status = this.$refs.status.value;
      const price = this.$refs.price.value;
      const platform = this.$refs.platform.value;
      const platform_link = this.$refs.platform_link.value;

      let guide = '';
      let guide_link = '';
      if (this.work_type === 'java_shader' || this.work_type === 'java_resourcepack') {
        guide = this.$refs.guide.value;
        guide_link = this.$refs.guide_link.value;
      }

      const template = `publish_${this.work_type}.yml`;
      const title = `${this.label_name}: ${name}`;

      const url = `https://github.com/HyperCol/MGCD/issues/new?&labels=${
        this.label_name
      }&projects=&template=${template}&title=${encodeURIComponent(
        title
      )}&name=${encodeURIComponent(name)}&author=${encodeURIComponent(
        author
      )}&style=${encodeURIComponent(style)}&status=${encodeURIComponent(
        status
      )}&price=${encodeURIComponent(price)}&platform=${encodeURIComponent(
        platform
      )}&platform_link=${encodeURIComponent(
        platform_link
      )}&guide=${encodeURIComponent(guide)}&guide_link=${encodeURIComponent(
        guide_link
      )}`;

      window.open(url);

      // 关闭表单
      this.closeForm();
    },
  },
};
</script>
