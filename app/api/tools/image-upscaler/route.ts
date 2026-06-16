import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitTask, waitForTask, getNodeList, mapInputsToNodes } from "@/lib/runninghub/client";

/**
 * POST /api/tools/image-upscaler
 *
 * 请求体: { imageUrl: string; scale?: 2 | 4 }
 * 响应:   { taskId: string; result?: { files: string[] } }
 */
export async function POST(request: NextRequest) {
  try {
    // 鉴权
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, scale = 2 } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "请提供 imageUrl（图片地址）" },
        { status: 400 },
      );
    }

    const webappId = "image-upscaler-real-esrgan";
    const inputs: Record<string, unknown> = { image_url: imageUrl, scale: Math.min(scale, 4) };
    // 获取节点结构并映射为 nodeInfoList
    const nodes = await getNodeList(webappId);
    const nodeInfoList = mapInputsToNodes(nodes, inputs as Record<string, string | number | undefined>);

    const { taskId } = await submitTask({
      webappId, // Runninghub 超分应用 ID
      nodeInfoList,
    });

    const result = await waitForTask(taskId);

    // 同步保存结果到数据库
    if (result?.files?.length) {
      await supabase.from("user_images").insert({
        user_id: auth.user.id,
        tool_type: "image-upscaler",
        prompt: imageUrl, // 原图 URL 作为 prompt
        image_urls: result.files,
      });
    }

    return NextResponse.json({ taskId, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
