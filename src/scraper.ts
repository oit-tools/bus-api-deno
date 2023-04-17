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

        // terminal, stop
        const terminal = doc.textContent!.split("条件１：")[1].split("／")[0];
        const stop = doc.textContent!.split("条件２：")[1].split("／")[0];

        // day of week
        // const dow = doc.querySelectorAll("font")[1].textContent;
        // console.log(dow);

        // timetable
        const table = doc.querySelector("#datalist")!.textContent;
        const timetable = table.split("\n").filter((s) => s !== "").map((s) => s.trim());

        const busInformation = [];
        for (let i = 0; i < timetable.length - 1; i += 4) {
            let [time, type, destination] = timetable[i].split(/[\[\]]/).filter((s) => s.trim() !== "");

            // remove space
            time = time.trim();
            destination = destination.trim();

            const schedule = time.includes("<") ? time.split("<")[1].split(">")[0].replace("定刻：", "").replace(/<.*>/, "") : time;

            busInformation.push({
                terminal,
                stop,
                time,
                schedule,
                type,
                destination
            });
        }
        console.log(busInformation);
    } catch (error) {
        console.log(error);
    }
};
