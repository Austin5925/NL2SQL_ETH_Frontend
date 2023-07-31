<template>
  <div class="prompt-window">
    <div class="prompt-content">
      <div class="prompt-which">
        <button @click="parseValue1" class="btn btn-in btn-info">
          聊天Prompt
        </button>
        <button @click="parseValue2" class="btn btn-in btn-info">
          查询Prompt
        </button>
      </div>
      <textarea
        class="prompt-input"
        v-model="localPrompt"
        @input="adjustTextareaHeight"
      ></textarea>
      <div class="prompt-buttons">
        <button
          id="prompt-save"
          @click="$emit('prompt-save')"
          class="btn btn-in btn-success"
        >
          保存
        </button>
        <button
          id="prompt-cancel"
          @click="$emit('prompt-cancel')"
          class="btn btn-in btn-danger"
        >
          关闭
        </button>
        <button
          id="prompt-restore"
          @click="$emit('prompt-reset')"
          class="btn btn-in btn-warning"
        >
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["propPromptValue"],
  emits: [
    "prompt-cancel",
    "prompt-save",
    "prompt-reset",
    "update:propPromptValue",
  ],
  data() {
    return {
      localPrompt: this.propPromptValue,
    };
  },
  watch: {
    propPromptValue(newVal) {
      this.localPrompt = newVal;
      if (this.propPromptValue) {
        // 第一个界面的prompt正确初始化
        this.localPrompt = this.propPromptValue.promptBaseChat;
        this.$nextTick(() => {
          this.adjustTextareaHeight({
            target: this.$el.querySelector(".prompt-input"),
          });
        });
        console.log(this.localPrompt);
      }
    },
    localPrompt(newVal) {
      this.$emit("update:propPromptValue", newVal);
    },
  },
  mounted() {
    // this.adjustTextareaHeight({ target: this.$el.querySelector('.prompt-input') });
    // 这一行然并卵，初始高度还是暴力调整，todo
    // this.$nextTick(() => {
    //   this.adjustTextareaHeight({ target: this.$el.querySelector('.prompt-input') });
    // });
  },
  methods: {
    adjustTextareaHeight(event) {
      event.target.style.height = "auto";
      event.target.style.height = event.target.scrollHeight + "px";
    },
    parseValue1() {
      console.log(this.propPromptValue);
      this.localPrompt = this.propPromptValue.promptBaseChat;
      this.$nextTick(() => {
        this.adjustTextareaHeight({
          target: this.$el.querySelector(".prompt-input"),
        });
      });
    },
    parseValue2() {
      this.localPrompt = this.propPromptValue.promptBaseQuery;
      this.$nextTick(() => {
        this.adjustTextareaHeight({
          target: this.$el.querySelector(".prompt-input"),
        });
      });
    },
  },
};
</script>

<style scoped>
.prompt-window {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.prompt-content {
  background-color: white;
  width: 80%;
  padding: 20px;
  border-radius: 5px;
}

.prompt-input {
  width: 100%;
  min-height: 220px;
  //height: 724px;
  margin-bottom: 20px;
}

.prompt-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.btn-in {
  width: 120px;
  margin: 10px;
}
</style>
