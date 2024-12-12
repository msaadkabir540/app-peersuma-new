export async function POST(request: any) {
  try {
    const createVideoProject = await request.json();
//ç
    if (createVideoProject && createVideoProject?.clientId) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}video-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": createVideoProject?.token,
        },
        body: JSON.stringify(createVideoProject),
      });
      const responseData = await response.json();
      return Response.json({ responseData });
    } else {
      console.error("client ID is missing");
    }
  } catch (error) {
    console.error("error ", error);
    return Response.json({ msg: "Invalid action", status: 400 }, { status: 400 });
  }
}

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}video-project/getall-video-project`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responseData = await response.json();
    return Response.json({ responseData, status: 200 });
  } catch (error) {
    console.error("error ", error);
    return Response.json({ msg: "Invalid action", status: 400 }, { status: 400 });
  }
}
