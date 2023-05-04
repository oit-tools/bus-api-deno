import { getBusInformation } from "./scraper.ts";
import { kuzuhaOit, nagaoOit, oitKuzuha, oitNagao } from "./urls.ts";
import { serve } from "https://deno.land/std@0.154.0/http/server.ts";

const PORT = 8080;

const handler = async (req: Request) => {
  let busInformation;
  if (req.method === "GET") {
    switch (new URL(req.url).pathname) {
      case "/oit-nagao":
        busInformation = await getBusInformation(oitNagao());
        break;
      case "/nagao-oit":
        busInformation = await getBusInformation(nagaoOit());
        break;
      case "/oit-kuzuha":
        busInformation = await getBusInformation(oitKuzuha());
        break;
      case "/kuzuha-oit":
        busInformation = await getBusInformation(kuzuhaOit());
        break;
      default:
        return new Response("Not Found", {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
    }
    return new Response(JSON.stringify(busInformation), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

await serve(handler, { port: PORT });
