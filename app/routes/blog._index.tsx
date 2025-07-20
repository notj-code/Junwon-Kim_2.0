import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import Paginator from "~/components/organisms/Paginator";
import { PostList } from "~/components/organisms/blog";

export const meta: MetaFunction = () => ([
  { title: "블로그 | LYnLab" },
]);

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const strapiUrl = context.env.STRAPI_API_URL;
  const urlParams = new URL(request.url).searchParams;
  const tagSlug = urlParams.get("tag");

  // 기본 populate 설정
  let apiUrl = `${strapiUrl}/api/posts?populate[author][populate]=avatar&populate=thumbnail&populate=tags`;

  // 태그 필터가 있으면 API URL에 필터를 추가합니다.
  if (tagSlug) {
    apiUrl += `&filters[tags][slug][$eq]=${tagSlug}`;
  }

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw json(null, { status: 500 });
  }

  const { data, meta } = await response.json();

  const posts = data.map((post: any) => ({
    ...post.attributes,
    id: post.id,
    thumbnailUrl: post.attributes.thumbnail?.data?.attributes?.url
      ? `${strapiUrl}${post.attributes.thumbnail.data.attributes.url}`
      : null,
    author: post.attributes.author?.data?.attributes,
    tags: post.attributes.tags?.data.map((tag: any) => tag.attributes),
  }));

  // 페이지네이션 정보 (현재는 Strapi의 기본값을 사용)
  const pageInfo = {
    hasPreviousPage: false,
    hasNextPage: false,
    startCursor: null,
    endCursor: null,
  };

  // 필터링된 태그 정보를 전달하기 위한 로직 (UI 표시에 사용)
  let filter = undefined;
  if (tagSlug && posts.length > 0) {
    const allTags = posts.flatMap(p => p.tags);
    const filteredTag = allTags.find(t => t.slug === tagSlug);
    if (filteredTag) {
      filter = { tags: [filteredTag] };
    }
  }

  return json({ posts, pageInfo, filter });
};

export default function index() {
  const { posts, pageInfo, filter } = useLoaderData<typeof loader>();

  return (
    <>
      <PostList posts={posts} filter={filter} />
      {/* <Paginator pageInfo={pageInfo} reversed={true} /> */}
    </>
  );
}
