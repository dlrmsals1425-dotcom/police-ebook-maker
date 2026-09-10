/* 로컬 저장 — localStorage만 사용, 외부 전송 없음 */
(function (g) {
  const EB = (g.EB = g.EB || {});
  const KEY = "police-ebook-maker:current";
  const FLAG = "police-ebook-maker:seen";

  EB.Store = {
    load: function () {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return EB.ensureProjectShape(JSON.parse(raw));
      } catch (e) {
        return null;
      }
    },
    save: function (project) {
      try {
        project.updatedAt = Date.now();
        localStorage.setItem(KEY, JSON.stringify(project));
        return true;
      } catch (e) {
        EB.toast("저장 용량이 부족합니다. JSON 백업을 내려받아 주세요.", true);
        return false;
      }
    },
    clear: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
    },
    isFirstVisit: function () {
      try {
        return !localStorage.getItem(FLAG);
      } catch (e) {
        return true;
      }
    },
    markSeen: function () {
      try {
        localStorage.setItem(FLAG, "1");
      } catch (e) {}
    },
    toJSON: function (project) {
      return JSON.stringify(project, null, 2);
    },
    fromJSON: function (text) {
      let data;
      try {
        data = JSON.parse(EB.stripBom(text));
      } catch (e) {
        throw new Error("JSON 형식이 아닙니다. 백업 파일을 확인해 주세요.");
      }
      return EB.ensureProjectShape(data);
    }
  };
})(window);
