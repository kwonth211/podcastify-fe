// Cloudflare Pages Functions types
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export async function onRequestGet(context: {
  env: { DAILYNEWSPOD_KV: KVNamespace };
  request: Request;
}): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const podcastKey = url.searchParams.get("key");

    if (!podcastKey) {
      return new Response(
        JSON.stringify({ error: "podcast key is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const kvKey = `play_count:${podcastKey}`;
    const count = await context.env.DAILYNEWSPOD_KV.get(kvKey);
    const countValue = count ? parseInt(count, 10) : 0;

    return new Response(JSON.stringify({ count: countValue }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error getting count:", error);
    return new Response(JSON.stringify({ count: 0, error: String(error) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export async function onRequestPost(context: {
  env: { DAILYNEWSPOD_KV: KVNamespace };
  request: Request;
}): Promise<Response> {
  try {
    const body = await context.request.json().catch(() => ({}));
    const podcastKey = body.key;

    if (!podcastKey) {
      return new Response(
        JSON.stringify({ error: "podcast key is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const kvKey = `play_count:${podcastKey}`;
    const currentCount = await context.env.DAILYNEWSPOD_KV.get(kvKey);
    const countValue = currentCount ? parseInt(currentCount, 10) : 0;
    const newCount = countValue + 1;

    await context.env.DAILYNEWSPOD_KV.put(kvKey, newCount.toString());

    return new Response(JSON.stringify({ count: newCount }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error incrementing count:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to increment count",
        details: String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
