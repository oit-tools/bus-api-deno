import { getBusInformation } from "./scraper.ts";
import { oitNagao, nagaoOit, oitKuzuha, kuzuhaOit } from "./urls.ts";
import { serve } from "https://deno.land/std@0.154.0/http/server.ts";

const PORT = 8080;

const handler = async (req: Request) => {
    if (req.method === "GET") {
        switch (new URL(req.url).pathname) {
            case "/oit-nagao":
                return new Response(
                    JSON.stringify(await getBusInformation(oitNagao())),
                )
            case "/nagao-oit":
                return new Response(
                    JSON.stringify(await getBusInformation(nagaoOit())),
                )
            case "/oit-kuzuha":
                return new Response(
                    JSON.stringify(await getBusInformation(oitKuzuha())),
                )
            case "/kuzuha-oit":
                return new Response(
                    JSON.stringify(await getBusInformation(kuzuhaOit())),
                )
            default:
                return new Response("Not Found", {
                    status: 404,
                });
        }
    } else {
        return new Response("Method Not Allowed", {
            status: 405,
        });
    }
};

await serve(handler, { port: PORT });
