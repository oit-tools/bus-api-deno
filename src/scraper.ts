import {
  DOMParser,
  HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

interface BusInformation {
  bus_service_status: boolean;
  dow: string;
  fetch_time: string;
  bus_timetables: BusTimetable[];
}

interface BusTimetable {
  terminal: string;
  station: string;
  departure_time: string;
  delay_minutes: string;
  type: string;
  destination: string;
}

const fetchBusInformation = async (url: string) => {
  try {
    const res = await fetch(url);

    // Shift_JIS to UTF-8
    const sjis = await res.arrayBuffer();
    const decoder = new TextDecoder("shift_jis");
    const text = decoder.decode(sjis);
    const encoder = new TextEncoder();
    const utf8 = encoder.encode(text);

    const html = new TextDecoder("utf-8").decode(utf8);
    const doc = new DOMParser().parseFromString(html, "text/html")!;

    return doc;
  } catch (error) {
    console.log("error", error);
  }
};

export const getBusInformation = async (urls: string[]) => {
  const busInformation: BusInformation = {} as BusInformation;
  const busTimetables: BusTimetable[] = [];

  for (const url of urls) {
    let doc: HTMLDocument | undefined = await fetchBusInformation(url);

    // retry
    if (doc && doc.textContent!.includes("操作をやり直してください")) {
      doc = await fetchBusInformation(url);
    }

    if (doc === undefined) {
      return;
    }

    // bus service status
    if (!(busInformation.bus_service_status) && doc.textContent!.includes("検索できませんでした")) {
        busInformation.bus_service_status = false;
    } else {
        busInformation.bus_service_status = true;
    }

    // day of week
    const dow = doc.querySelectorAll("font")[1].textContent;
    busInformation.dow = dow;

    // fetch time
    const fetchTime = doc.textContent!.split("。")[1].split("現在")[0].trim()
      .replace("時", ":").replace("分", "");
    busInformation.fetch_time = fetchTime;

    // terminal, station
    const terminal = doc.textContent!.split("条件１：")[1].split("／")[0];
    const station = doc.textContent!.split("条件２：")[1].split("／")[0];

    // timetable
    const table = doc.querySelector("#datalist")!.textContent;
    const timetable = table.split("\n").filter((s: string) => s !== "").map((
      s: string,
    ) => s.trim());

    for (let i = 0; i < timetable.length - 1; i += 4) {
      let [time, type, destination] = timetable[i].split(/[\[\]]/).filter((
        s: string,
      ) => s.trim() !== "");

      // remove space
      time = time.trim();
      destination = destination.trim();

      // delay
      let delay;
      if (time.includes("<")) {
        const scheduleTime = time.split("<")[1].split(">")[0].replace("定刻：", "")
          .replace(/<.*>/, "");
        delay = String(
          (Number(time.split(":")[0]) - Number(scheduleTime.split(":")[0])) *
              60 +
            (Number(time.split(":")[1]) - Number(scheduleTime.split(":")[1])),
        );
      } else {
        delay = "0";
      }

      const busTimetable: BusTimetable = {} as BusTimetable;
      busTimetable.terminal = terminal;
      busTimetable.station = station;
      busTimetable.departure_time = time;
      busTimetable.delay_minutes = delay;
      busTimetable.type = type;
      busTimetable.destination = destination;

      busTimetables.push(busTimetable);
    }
  }
  busInformation.bus_timetables = busTimetables;
  return busInformation;
};
