<template>
  <div class="illustration-window">
    <div class="illustration-content">
      <ul class="mb-3">
        目前的以太坊交易信息数据库表结构如下：
        <li>`Index`：int(11)</li>
        <li>`TxHash`：varchar(64)</li>
        <li>`Status`：int(11)</li>
        <li>`Block`：int(11)</li>
        <li>`Timestamp`：datetime</li>
        <li>`From`：varchar(42)</li>
        <li>`To`：varchar(42)</li>
        <li>`Value`：decimal(38,0)</li>
        <li>`ValueUSD`：double</li>
        <li>`GasFee`：decimal(38,0)</li>
        <li>`GasPrice`：decimal(38,0)</li>
        <li>`InputHex`：text</li>
        <li>`isERC20`：int(11)</li>
        <li>`TokenSymbol`：varchar(32)</li>
      </ul>
      <p class="mb-3">
        您可以阅读此表，提高提问效率。您也可以自己修改Prompt来自定义您的NL2SQL，系统将根据新的Prompt来进行回复。
      </p>
      <div class="prompt-buttons">
        <button
          id="prompt-cancel"
          @click="$emit('illustration-cancel')"
          class="btn btn-in btn-danger"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["illustration-cancel"],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
.illustration-window {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 65%;
  height: 100%;
}

.illustration-content {
  background-color: white;
  width: 60%;
  padding: 20px;
  border-radius: 5px;
}

.btn-in {
  width: 120px;
  margin: 10px 30px 18px 30px;
}
</style>
