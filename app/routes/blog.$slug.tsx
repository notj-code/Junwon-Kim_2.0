import { useLoaderData, useRouteError } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { json, type LoaderFunction, type MetaFunction } from "@remix-run/cloudflare";
import Container from "~/components/atoms/Container";
import { Divider } from "~/components/atoms/Divider";
import type { TableOfContents } from "~/components/organisms/blog";
import { ActivityButtons, PostComment, PostContent, PostIntro, PostTableOfContents, RelatedPosts } from "~/components/organisms/blog";
import Error from "~/components/templates/error/Error";
import { useState } from "react";
import { MarkdownBlob } from "~/components/molecules/blobviews";

const errorInternal = "internal_error";
const errorPostNotFound = "post_not_found";

type LoaderData = {
  post: any; // 타입을 간단하게 any로 설정합니다.
};

export const loader: LoaderFunction = async ({ context, params }) => {
  const slug = params.slug!;
  const strapiUrl = context.env.STRAPI_API_URL;

  // slug를 기준으로 Strapi API에서 게시물을 필터링하고 author, avatar, tags 정보를 함께 가져옵니다.
  const response = await fetch(`${strapiUrl}/api/posts?filters[slug][$eq]=${slug}&populate[author][populate]=avatar&populate=thumbnail&populate=tags`);

  if (!response.ok) {
    throw json({ error: errorInternal }, { status: 500 });
  }

  const { data } = await response.json();

  if (!data || data.length === 0) {
    throw json({ error: errorPostNotFound }, { status: 404 });
  }

  const post = {
    ...data[0].attributes,
    id: data[0].id,
    thumbnailUrl: data[0].attributes.thumbnail?.data?.attributes?.url
      ? `${strapiUrl}${data[0].attributes.thumbnail.data.attributes.url}`
      : null,
    author: data[0].attributes.author?.data?.attributes,
  };

  return json<LoaderData>({ post, strapiUrl });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: "블로그 | LYnLab" },
    ];
  }

  const { post } = data;
  return [
    { title: `${post.title} | LYnLab` },
    { name: "description", content: post.description },
    { name: "og:title", content: post.title },
    { name: "og:image", content: post.thumbnailUrl },
    { name: "og:description", content: post.description },
    { name: "og:url", content: `https://lynlab.co.kr/blog/${post.slug}` },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.description },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export function links() {
  return [
    { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/monokai.min.css" },
  ];
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const error: { data: any } = useRouteError() as any;
  let errorMessage = "";
  if (error?.data?.error === errorPostNotFound) {
    errorMessage = "작성된 글을 찾을 수 없어요 :(";
  } else {
    errorMessage = "알 수 없는 문제가 발생했어요 :(";
  }

  return <Error message={errorMessage} />;
};

export default function BlogPost() {
  const { post, strapiUrl } = useLoaderData<LoaderData>();
  const [toc, setToc] = useState<TableOfContents>([]);

  // `tags`와 `relatedPosts`는 아직 구현되지 않았으므로 비워둡니다.
  const relatedPosts: any[] = [];

  return (
    <>
      <Container className="max-w-5xl py-8">
        <div className="w-full flex flex-row-reverse">
          <div className="hidden md:block w-64 shrink-0">
            <div className="h-full w-full">
              <PostTableOfContents toc={toc} />
            </div>
          </div>

          <div className="min-w-0">
            <PostIntro
              title={post.title}
              description={post.description || null}
              thumbnailUrl={post.thumbnailUrl}
              createdAt={post.createdAt}
              author={post.author}
              tags={[]} // tags를 빈 배열로 전달
              strapiUrl={strapiUrl}
            />
            {/* 
              PostContent 대신 MarkdownBlob을 직접 사용하여 
              Strapi의 content 필드를 렌더링합니다.
            */}
            <div className="prose prose-lg mt-8">
              <MarkdownBlob text={post.content} />
            </div>
          </div>
        </div>

        {(relatedPosts.length > 0) && (
          <>
            <Divider />
            <RelatedPosts posts={relatedPosts} />
          </>
        )}
        <Divider />
        <PostComment />
      </Container>
      <ActivityButtons url={`https://lynlab.co.kr/blog/${post.slug}`} title={post.title} />
    </>
  );
}
