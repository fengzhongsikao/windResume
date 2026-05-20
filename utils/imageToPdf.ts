function concatBuffers(chunks: Uint8Array[]): ArrayBuffer {
  let total = 0;
  for (const c of chunks) total += c.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out.buffer;
}

function ascii(s: string): Uint8Array {
  const buf = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) buf[i] = s.charCodeAt(i);
  return buf;
}

/**
 * 将 JPEG 二进制数据封装为单页 PDF（无需第三方库）
 */
export function buildPdfFromJpeg(
  jpegBytes: Uint8Array,
  widthPt: number,
  heightPt: number,
): ArrayBuffer {
  const w = Math.round(widthPt);
  const h = Math.round(heightPt);
  const imgLen = jpegBytes.length;

  const chunks: Uint8Array[] = [];
  const objOffsets: number[] = [0];
  let pos = 0;

  const append = (data: Uint8Array) => {
    chunks.push(data);
    pos += data.length;
  };

  const startObject = (objNum: number) => {
    objOffsets[objNum] = pos;
  };

  append(ascii('%PDF-1.4\n'));

  startObject(1);
  append(ascii('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'));

  startObject(2);
  append(ascii('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'));

  startObject(3);
  append(
    ascii(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] ` +
        `/Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    ),
  );

  startObject(4);
  append(
    ascii(
      `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLen} >>\nstream\n`,
    ),
  );
  append(jpegBytes);
  append(ascii('\nendstream\nendobj\n'));

  startObject(5);
  const content = `q ${w} 0 0 ${h} 0 0 cm /Im1 Do Q`;
  append(ascii(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`));

  const xrefPos = pos;
  append(ascii('xref\n0 6\n0000000000 65535 f \n'));
  for (let i = 1; i <= 5; i++) {
    append(ascii(`${String(objOffsets[i]).padStart(10, '0')} 00000 n \n`));
  }
  append(ascii(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`));

  return concatBuffers(chunks);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const lookup: Record<string, number> = {};
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (let i = 0; i < chars.length; i++) lookup[chars[i]] = i;

  const len = base64.length;
  let padding = 0;
  if (base64.endsWith('==')) padding = 2;
  else if (base64.endsWith('=')) padding = 1;

  const outLen = Math.floor((len * 3) / 4) - padding;
  const out = new Uint8Array(outLen);
  let p = 0;

  for (let i = 0; i < len; i += 4) {
    const a = lookup[base64[i]];
    const b = lookup[base64[i + 1]];
    const c = lookup[base64[i + 2]];
    const d = lookup[base64[i + 3]];
    out[p++] = (a << 2) | (b >> 4);
    if (p < outLen) out[p++] = ((b & 15) << 4) | (c >> 2);
    if (p < outLen) out[p++] = ((c & 3) << 6) | d;
  }
  return out;
}
