import { defineStore } from "pinia";
import { ref } from "vue";

export const useProgrammingSelectionStore = defineStore("programmingSelection", () => {
  const selection = ref(null);

  function setSelection(data) {
    selection.value = data;
  }

  function clearSelection() {
    selection.value = null;
  }

  return {
    selection,
    setSelection,
    clearSelection,
  };
});