import {
  detectFileType,
  createMediaItemFromFile,
  getDefaultAnimationConfig,
  generateGalleryConfig,
} from "../../utils/galleryGenerator";

describe("detectFileType", () => {
  it("detects mp4 as video", () => {
    expect(detectFileType("video.mp4")).toBe("video");
  });

  it("detects webm as video", () => {
    expect(detectFileType("video.webm")).toBe("video");
  });

  it("detects mov as video", () => {
    expect(detectFileType("video.mov")).toBe("video");
  });

  it("detects avi as video", () => {
    expect(detectFileType("video.avi")).toBe("video");
  });

  it("detects gif as gif", () => {
    expect(detectFileType("animation.gif")).toBe("gif");
  });

  it("detects jpg as image", () => {
    expect(detectFileType("photo.jpg")).toBe("image");
  });

  it("detects png as image", () => {
    expect(detectFileType("photo.png")).toBe("image");
  });

  it("detects webp as image", () => {
    expect(detectFileType("photo.webp")).toBe("image");
  });

  it("handles uppercase extensions", () => {
    expect(detectFileType("VIDEO.MP4")).toBe("video");
    expect(detectFileType("IMAGE.JPG")).toBe("image");
    expect(detectFileType("ANIMATION.GIF")).toBe("gif");
  });

  it("defaults to image for unknown extensions", () => {
    expect(detectFileType("file.xyz")).toBe("image");
    expect(detectFileType("noextension")).toBe("image");
  });
});

describe("createMediaItemFromFile", () => {
  it("creates media item with correct structure", () => {
    const item = createMediaItemFromFile("gallery1", "image.jpg", 0);

    expect(item).toEqual({
      id: "gallery1-0",
      title: "",
      description: "",
      type: "image",
      url: "/assets/gallery1/image.jpg",
      thumbUrl: undefined,
      category: "gallery1",
    });
  });

  it("creates video item correctly", () => {
    const item = createMediaItemFromFile("gallery1", "video.mp4", 1);

    expect(item.type).toBe("video");
    expect(item.url).toBe("/assets/gallery1/video.mp4");
  });

  it("creates gif item correctly", () => {
    const item = createMediaItemFromFile("gallery1", "animation.gif", 2);

    expect(item.type).toBe("gif");
  });

  it("generates unique IDs based on gallery and index", () => {
    const item1 = createMediaItemFromFile("gallery1", "image1.jpg", 0);
    const item2 = createMediaItemFromFile("gallery1", "image2.jpg", 1);
    const item3 = createMediaItemFromFile("gallery2", "image1.jpg", 0);

    expect(item1.id).toBe("gallery1-0");
    expect(item2.id).toBe("gallery1-1");
    expect(item3.id).toBe("gallery2-0");
  });

  it("sets category to gallery ID", () => {
    const item = createMediaItemFromFile("test-gallery", "image.jpg", 0);
    expect(item.category).toBe("test-gallery");
  });
});

describe("getDefaultAnimationConfig", () => {
  it("returns default animation configuration", () => {
    const config = getDefaultAnimationConfig();

    expect(config).toEqual({
      effect: "fade",
      duration: 0.6,
      ease: "power2.inOut",
    });
  });
});

describe("generateGalleryConfig", () => {
  const testFiles = ["image1.jpg", "image2.png", "video.mp4"];

  it("generates gallery config with correct structure", () => {
    const config = generateGalleryConfig("test-gallery", testFiles);

    expect(config.id).toBe("test-gallery");
    expect(config.title).toBe("");
    expect(config.description).toBe("");
    expect(config.layout).toBe("grid");
  });

  it("creates media items for all files", () => {
    const config = generateGalleryConfig("test-gallery", testFiles);

    expect(config.items).toHaveLength(3);
  });

  it("sorts videos before images", () => {
    const config = generateGalleryConfig("test-gallery", testFiles);

    // Video should be first
    expect(config.items[0].type).toBe("video");
  });

  it("applies custom title and description", () => {
    const config = generateGalleryConfig("test-gallery", testFiles, {
      title: "Custom Title",
      description: "Custom Description",
    });

    expect(config.title).toBe("Custom Title");
    expect(config.description).toBe("Custom Description");
  });

  it("applies custom layout", () => {
    const config = generateGalleryConfig("test-gallery", testFiles, {
      layout: "carousel",
    });

    expect(config.layout).toBe("carousel");
  });

  it("applies custom animation settings", () => {
    const config = generateGalleryConfig("test-gallery", testFiles, {
      animation: {
        effect: "slide",
        duration: 1.0,
      },
    });

    expect(config.animation?.effect).toBe("slide");
    expect(config.animation?.duration).toBe(1.0);
  });

  it("applies transition time", () => {
    const config = generateGalleryConfig("test-gallery", testFiles, {
      transitionTime: 5000,
    });

    expect(config.transitionTime).toBe(5000);
  });

  it("handles empty file list", () => {
    const config = generateGalleryConfig("empty-gallery", []);

    expect(config.items).toHaveLength(0);
  });

  it("sorts files alphabetically within same type", () => {
    const files = ["c-image.jpg", "a-image.jpg", "b-image.jpg"];
    const config = generateGalleryConfig("test-gallery", files);

    expect(config.items[0].url).toContain("a-image.jpg");
    expect(config.items[1].url).toContain("b-image.jpg");
    expect(config.items[2].url).toContain("c-image.jpg");
  });
});
