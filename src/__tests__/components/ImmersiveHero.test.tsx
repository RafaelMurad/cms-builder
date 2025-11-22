import { render, screen } from "../utils";
import ImmersiveHero from "../../components/ImmersiveHero";

// Mock framer-motion with scroll hooks - filter out framer-specific props
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, style, initial, animate, whileInView, viewport, transition, ...rest }: any) => (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    ),
    h1: ({ children, className, initial, animate, transition, ...rest }: any) => (
      <h1 className={className} {...rest}>
        {children}
      </h1>
    ),
    p: ({ children, className, initial, animate, transition, ...rest }: any) => (
      <p className={className} {...rest}>
        {children}
      </p>
    ),
  },
  useScroll: () => ({
    scrollYProgress: { current: 0 },
  }),
  useTransform: () => 1,
}));

describe("ImmersiveHero", () => {
  const defaultProps = {
    title: "Test Title",
    subtitle: "Test Subtitle",
  };

  it("renders the title", () => {
    render(<ImmersiveHero {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
  });

  it("renders the subtitle when provided", () => {
    render(<ImmersiveHero {...defaultProps} />);
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    render(<ImmersiveHero title="Test Title" />);
    expect(screen.queryByText("Test Subtitle")).not.toBeInTheDocument();
  });

  it("has proper accessibility label on section", () => {
    render(<ImmersiveHero {...defaultProps} />);
    expect(screen.getByRole("region", { name: /hero section: test title/i })).toBeInTheDocument();
  });

  it("renders scroll indicator", () => {
    render(<ImmersiveHero {...defaultProps} />);
    expect(screen.getByText("Scroll")).toBeInTheDocument();
  });

  it("applies snap-start class to section", () => {
    render(<ImmersiveHero {...defaultProps} />);
    const section = document.querySelector("section.snap-start");
    expect(section).toBeInTheDocument();
  });
});

describe("ImmersiveHero - Image Background", () => {
  it("renders image when imageUrl is provided", () => {
    render(
      <ImmersiveHero
        title="Image Hero"
        imageUrl="/test-image.jpg"
      />
    );

    const image = screen.getByRole("img", { hidden: true });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });

  it("image has proper alt text", () => {
    render(
      <ImmersiveHero
        title="Image Hero"
        imageUrl="/test-image.jpg"
      />
    );

    const image = screen.getByRole("img", { hidden: true });
    expect(image).toHaveAttribute("alt", "Hero background image for Image Hero");
  });

  it("image has eager loading", () => {
    render(
      <ImmersiveHero
        title="Image Hero"
        imageUrl="/test-image.jpg"
      />
    );

    const image = screen.getByRole("img", { hidden: true });
    expect(image).toHaveAttribute("loading", "eager");
  });
});

describe("ImmersiveHero - Video Background", () => {
  it("renders video when videoUrl is provided", () => {
    render(
      <ImmersiveHero
        title="Video Hero"
        videoUrl="/test-video.mp4"
      />
    );

    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
  });

  it("video has proper attributes", () => {
    render(
      <ImmersiveHero
        title="Video Hero"
        videoUrl="/test-video.mp4"
      />
    );

    const video = document.querySelector("video") as HTMLVideoElement;
    expect(video).toHaveAttribute("autoPlay");
    expect(video).toHaveAttribute("loop");
    // React renders muted as a property, not an attribute
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("playsInline");
  });

  it("video has proper accessibility label", () => {
    render(
      <ImmersiveHero
        title="Video Hero"
        videoUrl="/test-video.mp4"
      />
    );

    const video = document.querySelector("video");
    expect(video).toHaveAttribute("aria-label", "Background video for Video Hero");
  });

  it("video takes priority over image", () => {
    render(
      <ImmersiveHero
        title="Hero"
        videoUrl="/test-video.mp4"
        imageUrl="/test-image.jpg"
      />
    );

    const video = document.querySelector("video");
    const image = screen.queryByRole("img", { hidden: true });

    expect(video).toBeInTheDocument();
    expect(image).not.toBeInTheDocument();
  });
});

describe("ImmersiveHero - Gradient Background", () => {
  it("renders gradient when no media is provided", () => {
    render(<ImmersiveHero title="Gradient Hero" />);

    const gradient = document.querySelector(".bg-gradient-to-br");
    expect(gradient).toBeInTheDocument();
  });
});

describe("ImmersiveHero - Accessibility", () => {
  it("decorative elements are hidden from screen readers", () => {
    render(
      <ImmersiveHero
        title="Test Hero"
        imageUrl="/test.jpg"
      />
    );

    // Check for aria-hidden on decorative elements
    const hiddenElements = document.querySelectorAll("[aria-hidden='true']");
    expect(hiddenElements.length).toBeGreaterThan(0);
  });

  it("has motion-reduce classes for reduced motion preference", () => {
    render(<ImmersiveHero title="Test Hero" />);

    const elementsWithMotionReduce = document.querySelectorAll("[class*='motion-reduce']");
    expect(elementsWithMotionReduce.length).toBeGreaterThan(0);
  });
});
