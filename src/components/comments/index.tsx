"use client";

/* eslint-disable @next/next/no-img-element */
import { CommentApiResponse } from "@/interface";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import Pagination from "../Pagination";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentProps {
  storeId: number;
  page: string;
}

export default function Comments({ storeId, page = "1" }: CommentProps) {
  const { status } = useSession();

  const fetchComments = async () => {
    const { data } = await axios(
      `/api/comments?storeId=${storeId}&limit=5&page=${page}`
    );

    return data as CommentApiResponse;
  };

  const { data: comments, refetch } = useQuery(
    `comments-${storeId}-${page}`,
    fetchComments
  );

  return (
    <div className="md:max-w-2xl py-8 px-2 mb-20 mx-auto">
      {/* comment form */}
      {status === "authenticated" && (
        <CommentForm
          storeId={storeId}
          refetch={refetch}
        />
      )}
      {/* comment list */}
      <CommentList comments={comments} />
      {/* pagination */}
      <Pagination
        total={comments?.totalPage}
        page={page}
        pathname={`/stores/${storeId}`}
      />
    </div>
  );
}
