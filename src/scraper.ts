import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

export const getBusInformation = async (urls: string[]) => {
    try {
        const res = await fetch(urls[0]);

        // Shift_JIS to UTF-8
        const sjis = await res.arrayBuffer();
        const decoder = new TextDecoder("shift_jis");
        const text = decoder.decode(sjis);
        const encoder = new TextEncoder();
        const utf8 = encoder.encode(text);

        const html = new TextDecoder("utf-8").decode(utf8);
        const doc = new DOMParser().parseFromString(html, "text/html")!;

        const dow = doc.querySelectorAll("font")[1].textContent;
    } catch (error) {
        console.log(error);
    }
};
