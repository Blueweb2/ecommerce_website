import type { Story } from "@/types/story";
import StoryCard from "./StoryCard";

export default function StoryGrid({ stories }: { stories: Story[] }) {
  return <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{stories.map((story, index) => <StoryCard key={story._id} story={story} priority={index < 3} />)}</div>;
}
