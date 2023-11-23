<template>
  <div class="flex flex-col h-screen">
    <div class="flex flex-nowrap fixed w-full items-baseline top-0 px-6 py-4 bg-gray-100">
      <div class="text-2xl font-bold">AI 客服</div>
      <div class="ml-4 text-sm text-gray-500">
        基于 OpenAI 的 ChatGPT 自然语言模型人工智能对话
      </div>
      <div class="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-white rounded-md" @click="clickConfig()">
        设置
      </div>
    </div>

    <div class="flex-1 mx-2 mt-20 mb-2" ref="chatListDom">
      <div class="group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg" :key="index"
        v-for="(item, index) of messageList.filter((v) => v.role !== 'system')">
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold">{{ roleAlias[item.role] }}：</div>
          <Copy class="invisible group-hover:visible" :content="item.content" />
        </div>
        <div>
          <div class="prose text-sm text-slate-600 leading-relaxed" v-if="item.content" v-html="md.render(item.content)">
          </div>
          <Loding v-else />
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 w-full p-6 pb-8 bg-gray-100">
      <div class="-mt-2 mb-2 text-sm text-gray-500" v-if="isConfig">
        请输入请求 token：
      </div>
      <div class="flex">
        <input class="input" :type="isConfig ? 'password' : 'text'" :placeholder="isConfig ? 'xxxxxxxxxx' : '请输入'"
          v-model="messageContent" @keydown.enter="isTalking || sendOrSave()" />
        <button class="btn" :disabled="isTalking" @click="sendOrSave()">
          {{ isConfig ? "保存" : "发送" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";

import Loding from "@/components/Loding.vue";
import Copy from "@/components/Copy.vue";

import { md } from "@/composables/markdown";
import { useSecret } from '@/composables/secret'
import { useMessage } from '@/composables/message'

const isConfig = ref(true);

const chatListDom = ref<HTMLDivElement>();
const roleAlias = { user: "You", assistant: "Assistant", system: "System" };

const { getAPIKey, saveAPIKey } = useSecret()
const { isTalking, messageContent, messageList, sendChatMessage, clearMessageContent } = useMessage()

onMounted(() => {
  if (getAPIKey()) {
    switchConfigStatus();
  }
});

const sendOrSave = () => {
  if (!messageContent.value.length) return;

  if (isConfig.value) {
    if (saveAPIKey(messageContent.value.trim())) {
      switchConfigStatus();
    }
    clearMessageContent();
  } else {
    sendChatMessage(undefined, getAPIKey());
  }
};

const switchConfigStatus = () => (isConfig.value = !isConfig.value);

const clickConfig = () => {
  if (!isConfig.value) {
    messageContent.value = getAPIKey();
  } else {
    clearMessageContent();
  }
  switchConfigStatus();
};

const scrollToBottom = () => {
  if (!chatListDom.value) return;
  scrollTo(0, chatListDom.value.scrollHeight);
};

watch(messageList.value, () => nextTick(() => scrollToBottom()));
</script>

<style scoped>
pre {
  font-family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica,
    "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB",
    "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN",
    "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti",
    SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
}
</style>
