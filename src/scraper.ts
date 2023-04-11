import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

export const getBusInformation = async (urls: string[]) => {
    try {
        const res = await fetch(urls[0]);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html")!;

        const dow = doc.querySelector("font[color='red']")?.textContent;
        console.log(dow);
    } catch (error) {
        console.log(error);
    }
};
