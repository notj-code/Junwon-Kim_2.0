import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { Divider } from "~/components/atoms/Divider";

type PostIntroProps = {
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  createdAt: Date;
  author?: {
    name: string;
    avatar?: {
      data?: {
        attributes?: {
          url: string;
        }
      }
    }
  };
  tags: {
    slug: string;
    name: string;
  }[];
  strapiUrl: string;
};

export default function PostIntro(
  { title, description, thumbnailUrl, createdAt, author, tags, strapiUrl }: PostIntroProps,
) {
  const isOldPost = dayjs(createdAt).isBefore(dayjs().subtract(1, "year"));
  const avatarRelativeUrl = author?.avatar?.data?.attributes?.url;

  return (
    <>
      {thumbnailUrl && (
        <div className="mb-16 w-screen md:w-full -mx-4 md:mx-0 aspect-video">
          <img className="h-full w-full object-cover md:rounded-xl md:shadow-xl" src={thumbnailUrl} alt="게시물의 썸네일 이미지" />
        </div>
      )}
      <p className="my-8 text-3xl md:text-5xl md:leading-tight font-black" style={{ wordBreak: "keep-all" }}>{title}</p>
      <p className="text-lg">{description}</p>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        {author && (
          <div className="flex items-center pr-2 border-r border-gray-300">
            {avatarRelativeUrl ? (
              <img src={`${strapiUrl}${avatarRelativeUrl}`} alt={author.name} className="w-6 h-6 rounded-full mr-2" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 rounded-full mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
            <span className="font-semibold">{author.name}</span>
          </div>
        )}
        <span className="px-2 border-r border-gray-300">{dayjs(createdAt).format("YYYY-MM-DD")}</span>
        {tags.map((tag) => (
          <Link to={`/blog?tag=${tag.slug}`} key={`tag-${tag.slug}`} className="ml-2">
            <span className="text-gray-700 cursor-pointer hover:underline">#{tag.name}</span>
          </Link>
        ))}
      </div>
      <Divider />
      {isOldPost ? (
        <div className="my-4 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded text-gray-100 shadow-xl shadow-gray-100">
          <p>💡 이 글은 작성된지 1년 이상 지났습니다. 정보글의 경우 최신 내용이 아닐 수 있음에 유의해주세요.</p>
        </div>
      ) : null}
    </>
  );
}
