import React, { useCallback } from "react";

import Link from "@/components/Link";
import { PageSEO } from "@/components/SEO";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { getAllFilesFrontMatter } from "@/lib/mdx";
import formatDate from "@/lib/utils/formatDate";


import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "@/components/EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";

const MAX_DISPLAY = 5;

export async function getStaticProps() {
	const posts = await getAllFilesFrontMatter("blog");
	return { props: { posts } };
}

export default function Home({ posts }) {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

	const onButtonClick = useCallback((emblaApi) => {
		const { autoplay } = emblaApi.plugins();
		if (!autoplay) return;
		if (autoplay.options.stopOnInteraction !== false) autoplay.stop();
	}, []);
	const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
		emblaApi,
		onButtonClick
	);

	const handleSlider = (slug) => {
		window.open(`/blog/${slug}`, "_self");
	};

	return (
		<>
			<PageSEO
				title={siteMetadata.title}
				description={siteMetadata.description}
			/>
			<div id="embla__viewport" className="overflow-hidden" ref={emblaRef}>
				{/* Featured Posts */}
				{!posts.length && "No posts found."}
				<div id="embla__container" className="flex">
					{posts.map((frontMatter) => {
						if (frontMatter.featured) {
							const { slug, date, title, summary, tags, featuredImage } =
								frontMatter;
							return (
								<div
									id="embla__slide"
									className="mx-10 flex-[0_0_100%] cursor-pointer overflow-clip rounded-lg text-center"
									key={slug}
									onClick={() => handleSlider(slug)}
								>
									<div className=" flex h-48 items-center justify-center">
										<div className="absolute z-50 w-full font-sans text-2xl font-bold text-white hover:text-orange-200">
											{title}
										</div>
										<img
											src={featuredImage}
											className="-z-50 w-full object-fill brightness-50 filter"
										/>
									</div>
								</div>
							);
						}
					})}
				</div>

				<div
					id="embla__dots"
					className="z-10 relative -top-5 flex w-full justify-center"
				>
					{scrollSnaps.map((_, index) => (
						<DotButton
							key={index}
							onClick={() => onDotButtonClick(index)}
							id={"embla__dot".concat(
								index === selectedIndex ? " embla__dot--selected" : ""
							)}
							className={
								index === selectedIndex
									? "mx-1.5 h-1.5 w-8 rounded-full bg-primary-400"
									: "mx-1.5 h-1.5 w-8 rounded-full bg-gray-200 hover:bg-primary-200"
							}
						/>
					))}
				</div>
			</div>
			<div className="divide-y divide-gray-200 dark:divide-gray-700">
				<div className="space-y-2 pb-8 pt-6 md:space-y-5">
					<h1 className="text-xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-10 md:text-4xl md:leading-14">
						最新文章
					</h1>
					<p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
						{siteMetadata.description}
					</p>
				</div>
				<ul className="divide-y divide-gray-200 dark:divide-gray-700">
					{!posts.length && "No posts found."}
					{posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
						const { slug, date, title, summary, tags } = frontMatter;
						return (
							<li key={slug} className="py-12">
								<article>
									<div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
										<dl>
											<dt className="sr-only">Published on</dt>
											<dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
												<time dateTime={date}>{formatDate(date)}</time>
											</dd>
										</dl>
										<div className="space-y-5 xl:col-span-3">
											<div className="space-y-6">
												<div>
													<h2 className="text-2xl font-bold leading-8 tracking-tight">
														<Link
															href={`/blog/${slug}`}
															className="text-gray-900 dark:text-gray-100"
														>
															{title}
														</Link>
													</h2>
													<div className="flex flex-wrap">
														{tags.map((tag) => (
															<Tag key={tag} text={tag} />
														))}
													</div>
												</div>
												<div className="prose max-w-none text-gray-500 dark:text-gray-400">
													{summary}
												</div>
											</div>
											<div className="text-base font-medium leading-6">
												<Link
													href={`/blog/${slug}`}
													className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
													aria-label={`Read "${title}"`}
												>
													Read more &rarr;
												</Link>
											</div>
										</div>
									</div>
								</article>
							</li>
						);
					})}
				</ul>
			</div>
			{posts.length > MAX_DISPLAY && (
				<div className="flex justify-end text-base font-medium leading-6">
					<Link
						href="/blog"
						className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
						aria-label="all posts"
					>
						全部文章 &rarr;
					</Link>
				</div>
			)}
		</>
	);
}
