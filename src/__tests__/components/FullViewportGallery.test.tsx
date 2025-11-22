import { render, screen } from "../utils";
import FullViewportGallery from "../../components/FullViewportGallery";
import { mockGalleries } from "../utils";

// Mock framer-motion - filter out framer-specific props
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, initial, whileInView, viewport, transition, ...rest }: any) => (
      <div className={className} {...rest}>
        {children}
      </div>
    ),
    p: ({ children, className, initial, whileInView, viewport, transition, ...rest }: any) => (
      <p className={className} {...rest}>
        {children}
      </p>
    ),
    h2: ({ children, className, id, initial, whileInView, viewport, transition, ...rest }: any) => (
      <h2 className={className} id={id} {...rest}>
        {children}
      </h2>
    ),
  },
}));

describe("FullViewportGallery", () => {
  it("renders all galleries", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    expect(screen.getByText("Gallery One")).toBeInTheDocument();
    expect(screen.getByText("Gallery Two")).toBeInTheDocument();
  });

  it("renders with proper accessibility region", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    expect(screen.getByRole("region", { name: /portfolio galleries/i })).toBeInTheDocument();
  });

  it("renders sections with aria-labelledby linking to titles", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    // Each section should be labelled by its title
    const sections = document.querySelectorAll("section[aria-labelledby]");
    expect(sections).toHaveLength(mockGalleries.length);
  });

  it("displays gallery descriptions", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    expect(screen.getByText("First gallery description")).toBeInTheDocument();
    expect(screen.getByText("Second gallery description")).toBeInTheDocument();
  });

  it("renders project numbers", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    expect(screen.getByText("01 / 02")).toBeInTheDocument();
    expect(screen.getByText("02 / 02")).toBeInTheDocument();
  });

  it("renders images for image galleries", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    const images = screen.getAllByRole("img", { hidden: true });
    expect(images.length).toBeGreaterThan(0);
  });

  it("does not render empty galleries", () => {
    const galleriesWithEmpty = [
      ...mockGalleries,
      {
        id: "empty-gallery",
        title: "Empty Gallery",
        description: "This gallery has no items",
        layout: "grid" as const,
        items: [],
      },
    ];

    render(<FullViewportGallery galleries={galleriesWithEmpty} />);

    // Empty gallery title should not be rendered
    expect(screen.queryByText("Empty Gallery")).not.toBeInTheDocument();
  });

  it("applies snap-start class to sections", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    const sections = document.querySelectorAll("section.snap-start");
    expect(sections).toHaveLength(mockGalleries.length);
  });

  it("renders with motion-reduce classes for accessibility", () => {
    render(<FullViewportGallery galleries={mockGalleries} />);

    // Check for motion-reduce classes
    const elementsWithMotionReduce = document.querySelectorAll("[class*='motion-reduce']");
    expect(elementsWithMotionReduce.length).toBeGreaterThan(0);
  });
});

describe("FullViewportGallery - Video Handling", () => {
  const videoGalleries = [
    {
      id: "video-gallery",
      title: "Video Gallery",
      description: "Gallery with video",
      layout: "grid" as const,
      items: [
        {
          id: "video-1",
          title: "Video Item",
          description: "A video item",
          type: "video" as const,
          url: "/assets/test/video.mp4",
          category: "video",
        },
      ],
    },
  ];

  it("renders video element for video galleries", () => {
    render(<FullViewportGallery galleries={videoGalleries} />);

    const video = document.querySelector("video") as HTMLVideoElement;
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("autoPlay");
    expect(video).toHaveAttribute("loop");
    // React renders muted as a property, not an attribute
    expect(video.muted).toBe(true);
  });

  it("video has proper accessibility attributes", () => {
    render(<FullViewportGallery galleries={videoGalleries} />);

    const video = document.querySelector("video");
    expect(video).toHaveAttribute("aria-label");
  });
});
