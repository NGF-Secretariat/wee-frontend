import { NextResponse } from 'next/server';

export async function GET() {
    // const url = process.env.KOBO_COLLECT_URL;
    // const token = process.env.KOBOTOOLBOX_TOKEN;
    const url = "https://kf.kobotoolbox.org/api/v2/assets/aCgDGgQGkQB4SomDXERkzZ/data";
    const token = "74d80a71827db800cc87e07bd574d4ffc7be9b7a";

    // 👇 add this to see what's happening
    // console.log('URL:', url);
    // console.log('TOKEN:', token);

    if (!url || !token) {
        return NextResponse.json(
            { error: 'Missing env vars', url, token },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Token ${token}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json(
                { error: `KoboToolbox error: ${response.status}`, detail: text },
                { status: response.status }
            );
        }

        const data = await response.json();

        // console.log('data from kobo', data);

        return NextResponse.json(data);
    } catch (err: any) {
        console.log('error from kobo', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}