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
          @click="promptSave"
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
          @click="promptReset"
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
      localPrompt: "",
      localPromptCache: this.propPromptValue,
      localPromptBackup: {}, // 也可以考虑放在created中来防止值被修改
      currentPromptType: "chat",
      isFirstTime: null,
    };
  },
  created() {
    this.isFirstTime = true;
  },
  watch: {
    propPromptValue(newVal) {
      this.localPrompt = newVal;
      if (this.propPromptValue) {
        // 第一个界面的prompt正确初始化
        this.localPrompt = this.propPromptValue.promptBaseChat;
        this.localPromptCache = this.propPromptValue;
        this.adjustTextareaHeightReal();
        console.log(this.localPromptCache);
        if (
          Object.keys(this.localPromptBackup).length === 0 &&
          Object.keys(this.localPrompt).length !== 0 &&
          this.isFirstTime
        ) {
          // 用于重置Prompt，仅使用一次
          // 参数防止空值传入更新
          // 这里的localPromptBackup是{}，要用Object.keys()判断是否为空
          console.log("1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          this.localPromptBackup = { ...this.propPromptValue };
          this.isFirstTime = false;
          // 引用传递改为值传递
        }
        console.log(this.localPromptBackup);
      }
    },
    localPrompt(newVal) {
      console.log(newVal);
      if (this.currentPromptType === "chat") {
        this.localPromptCache.promptBaseChat = newVal;
        this.localPrompt = this.propPromptValue.promptBaseChat;
        this.$emit("update:propPromptValue", {
          promptBaseChat: newVal,
          promptBaseQuery: this.localPromptCache.promptBaseQuery,
        });
      } else {
        if (newVal !== this.localPromptCache.promptBaseChat) {
          this.localPromptCache.promptBaseQuery = newVal;
          this.localPrompt = this.propPromptValue.promptBaseQuery;
          this.$emit("update:propPromptValue", {
            promptBaseChat: this.localPromptCache.promptBaseChat,
            promptBaseQuery: newVal,
          });
        } else {
          console.log("点击查询时出现的bug难道没修复好？！");
        }
      }
      this.adjustTextareaHeightReal();
      console.log(this.localPromptCache);
      console.log(this.localPromptBackup);
    },
  },
  mounted() {},
  methods: {
    adjustTextareaHeight(event) {
      const maxHeight = 650;
      event.target.style.height = "auto";
      event.target.style.height =
        Math.min(Math.max(event.target.scrollHeight, 220), maxHeight) + "px";
    },
    adjustTextareaHeightReal() {
      this.$nextTick(() => {
        this.adjustTextareaHeight({
          target: this.$el.querySelector(".prompt-input"),
        });
      });
    },
    parseValue1() {
      console.log(this.propPromptValue);
      this.currentPromptType = "chat";
      this.localPrompt = this.propPromptValue.promptBaseChat;
      this.adjustTextareaHeightReal();
    },
    parseValue2() {
      this.currentPromptType = "query";
      this.localPrompt = this.propPromptValue.promptBaseQuery;
      this.adjustTextareaHeightReal();
    },
    promptReset() {
      if (this.currentPromptType === "chat") {
        this.localPrompt = this.localPromptBackup.promptBaseChat;
        this.localPromptCache.promptBaseChat =
          this.localPromptBackup.promptBaseChat;
        console.log(this.localPrompt);
      } else {
        this.localPrompt = this.localPromptBackup.promptBaseQuery;
        this.localPromptCache.promptBaseQuery =
          this.localPromptBackup.promptBaseQuery;
      }
      this.adjustTextareaHeightReal();
      this.$emit("prompt-reset");
    },
    promptSave() {
      if (this.currentPromptType === "chat") {
        this.$emit("prompt-save", 1);
      } else {
        this.$emit("prompt-save", 0);
      }
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
  width: 62%;
  padding: 20px;
  border-radius: 5px;
}

.prompt-input {
  width: 100%;
  min-height: 220px;
  max-height: 85% !important;
  //height: 724px;
  margin-bottom: 20px;
}

.prompt-buttons,
.prompt-which {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-in {
  width: 120px;
  margin: 10px 30px 18px 30px;
}
</style>
