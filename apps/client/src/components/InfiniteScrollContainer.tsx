import { useInView } from "react-intersection-observer";

export interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  scrollDirection: "top" | "bottom";
  onEndReached: () => void;
  className?: string;
}

export default function InfiniteScrollContainer({
  children,
  scrollDirection,
  onEndReached,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "50px",
    onChange(inView) {
      if (inView) {
        onEndReached();
      }
    },
  });

  return (
    <div className={className}>
      {scrollDirection === "top" && <div ref={ref} />}
      {children}
      {scrollDirection === "bottom" && <div ref={ref} />}
    </div>
  );
}
