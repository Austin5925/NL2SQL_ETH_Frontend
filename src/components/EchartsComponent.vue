<script>
export default {
  props: ["data"],
};
</script>

<template>
  <div>
    <div class="mt-5 mb-3">
      查询结果:
      <p style="font-weight: bold">
        {{ data }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
