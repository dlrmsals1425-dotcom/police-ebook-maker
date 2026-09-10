/* 무압축 ZIP — EPUB용, 외부 라이브러리 없음 */
(function (g) {
  const EB = (g.EB = g.EB || {});
  const CRC_TABLE = (function () {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(u8) {
    let c = 0xffffffff;
    for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function u16(n) {
    return new Uint8Array([n & 255, (n >>> 8) & 255]);
  }
  function u32(n) {
    return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]);
  }
  function concat(parts) {
    let n = 0;
    parts.forEach(function (p) {
      n += p.length;
    });
    const out = new Uint8Array(n);
    let o = 0;
    parts.forEach(function (p) {
      out.set(p, o);
      o += p.length;
    });
    return out;
  }
  function enc(s) {
    return new TextEncoder().encode(s);
  }

  EB.zipStore = function (files) {
    const locals = [];
    const centrals = [];
    let offset = 0;
    files.forEach(function (f) {
      const name = enc(f.name);
      const data = f.data instanceof Uint8Array ? f.data : enc(String(f.data || ""));
      const crc = crc32(data);
      const local = concat([
        enc("PK\x03\x04"),
        new Uint8Array([20, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0),
        name,
        data
      ]);
      const central = concat([
        enc("PK\x01\x02"),
        new Uint8Array([20, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        name
      ]);
      locals.push(local);
      centrals.push(central);
      offset += local.length;
    });
    const cd = concat(centrals);
    const eocd = concat([
      enc("PK\x05\x06"),
      new Uint8Array([0, 0, 0, 0]),
      u16(files.length),
      u16(files.length),
      u32(cd.length),
      u32(offset),
      u16(0)
    ]);
    return concat(locals.concat([cd, eocd]));
  };

  EB.downloadBytes = function (filename, u8, mime) {
    const blob = new Blob([u8], { type: mime || "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 800);
  };
})(typeof window !== "undefined" ? window : global);
