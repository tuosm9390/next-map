import prisma from "@/db";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/authoptions";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") as string;
  const limit = searchParams.get("limit") as string;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ status: 401 });
  }

  // GET 요청 처리
  const count = await prisma.like.count({
    where: {
      userId: session.user.id,
    },
  });

  const skipPage = parseInt(page) - 1;

  const likes = await prisma.like.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      userId: session.user.id,
    },
    include: {
      store: true,
    },
    skip: skipPage * parseInt(limit),
    take: parseInt(limit),
  });

  return NextResponse.json(
    {
      data: likes,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit)),
    },
    {
      status: 200,
    }
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // 찜하기 로직 처리
  const { storeId }: { storeId: number } = await req.json();

  // Like 데이터가 있는지 확인
  let like = await prisma.like.findFirst({
    where: {
      storeId,
      userId: session?.user?.id,
    },
  });

  // 만약 이미 찜을 했다면, 해당 like 데이터 삭제. 아니라면, 데이터 생성
  if (like) {
    // 이미 찜을 한 상황
    like = await prisma.like.delete({
      where: {
        id: like.id,
      },
    });
    return NextResponse.json(like, {
      status: 200,
    });
  } else {
    // 찜을 하지 않은 상황
    like = await prisma.like.create({
      data: {
        storeId,
        userId: session?.user?.id as unknown as number,
      },
    });

    return NextResponse.json(like, {
      status: 201,
    });
  }
}
